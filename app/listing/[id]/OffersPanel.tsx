
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Offer = {
  id: string;
  thread_id: string;
  post_id: string;
  buyer_id: string;
  seller_id: string;
  created_by: string;
  amount: number | string;
  quantity: number | string;
  status: string;
  expires_at: string;
  created_at: string;
};

type Props = {
  listingId: string;
  sellerId: string;
  listingStatus: string;
};

const supabase = createClient();

const money = (value: number | string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));

const dateLabel = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const statusLabel: Record<string, string> = {
  pending: "Awaiting response",
  countered: "Counteroffer made",
  accepted: "Accepted",
  declined: "Declined",
  withdrawn: "Withdrawn",
  expired: "Expired",
};

export default function OffersPanel({
  listingId,
  sellerId,
  listingStatus,
}: Props) {
  const [userId, setUserId] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("1");
  
  const [counterFor, setCounterFor] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterQuantity, setCounterQuantity] = useState("1");
  
  const isSeller = userId !== "" && userId === sellerId;
  const isActive = listingStatus === "active";

  const loadOffers = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setUserId(user?.id ?? "");

    if (!user) {
      setOffers([]);
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("listing_offers")
      .select(
      "id, thread_id, post_id, buyer_id, seller_id, created_by, amount, quantity, status, expires_at, created_at"
      )
      .eq("post_id", listingId)
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(
        "Offers could not be loaded. Please refresh and try again. " +
          queryError.message
      );
      setOffers([]);
    } else {
      setOffers((data ?? []) as Offer[]);
    }

    setLoading(false);
  }, [listingId]);

  useEffect(() => {
    void loadOffers();
  }, [loadOffers]);

  async function createOffer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!userId) {
      setError("Please sign in before making an offer.");
      return;
    }

    const parsedAmount = Number(amount);
    const parsedQuantity = Number(quantity);

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      setError("Enter a valid offer amount and quantity.");
      return;
    }

    setBusy(true);

    const { error: rpcError } = await supabase.rpc(
      "create_listing_offer",
      {
        p_post_id: listingId,
        p_amount: parsedAmount,
        p_quantity: parsedQuantity,
        p_note: null,
      }
    );

    setBusy(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setAmount("");
    setQuantity("1");
    setMessage("Your offer has been submitted.");
    await loadOffers();
  }

    async function respond(
    offer: Offer,
    action: "accept" | "decline" | "withdraw" | "counter",
    counter?: {
      amount: number;
      quantity: number;
    }
  ) {
  {
    setError("");
    setMessage("");

    if (action === "counter" && !counter) {
      setError("Enter a valid counteroffer amount and quantity.");
      return;
    }

    setBusy(true);

    const { error: rpcError } = await supabase.rpc(
      "respond_listing_offer",
      {
        p_offer_id: offer.id,
        p_action: action,
        p_amount: counter?.amount ?? null,
        p_quantity: counter?.quantity ?? null,
        p_note: null,
      }
    );

    setBusy(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setCounterFor(null);
    setCounterAmount("");
    setCounterQuantity("1");
    
    const successMessages: Record<string, string> = {
      accept: "Offer accepted.",
      decline: "Offer declined.",
      withdraw: "Offer withdrawn.",
      counter: "Counteroffer submitted.",
    };

    setMessage(successMessages[action]);
    await loadOffers();
  }

  function submitCounter(
    event: React.FormEvent<HTMLFormElement>,
    offer: Offer
  ) {
    event.preventDefault();

    const parsedAmount = Number(counterAmount);
    const parsedQuantity = Number(counterQuantity);

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      setError("Enter a valid counteroffer amount and quantity.");
      return;
    }

    void respond(offer, "counter", {
      amount: parsedAmount,
      quantity: parsedQuantity,
    });
  }

  const latestPending = [...offers]
    .reverse()
    .find(
      (offer) =>
        offer.status === "pending" &&
        new Date(offer.expires_at).getTime() > Date.now()
    );

  const canMakeOffer =
    Boolean(userId) &&
    !isSeller &&
    isActive &&
    !latestPending &&
    !offers.some((offer) => offer.status === "accepted");

  return (
    <section
      style={{
        marginTop: 24,
        padding: 20,
        borderRadius: 20,
        border: "1px solid rgba(216,213,160,0.55)",
        background:
          "linear-gradient(145deg, rgba(255,253,245,0.97), rgba(244,241,222,0.94))",
        color: "#173c2a",
        boxShadow: "0 12px 32px rgba(10,35,23,0.12)",
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 750, margin: "0 0 6px" }}>
        Offers & Negotiation
      </h2>
      <p style={{ margin: "0 0 18px", lineHeight: 1.6, color: "#526456" }}>
        Discuss the price and quantity directly on this listing. Each
        counteroffer is saved in the negotiation history.
      </p>

      {!userId && !loading && (
        <p style={{ marginBottom: 16 }}>
          Sign in to make or respond to offers.
        </p>
      )}

      {message && (
        <p
          role="status"
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#e5f3e8",
            color: "#185c34",
            marginBottom: 14,
          }}
        >
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#fff0eb",
            color: "#9b3023",
            overflowWrap: "anywhere",
            marginBottom: 14,
          }}
        >
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading offers…</p>
      ) : (
        <>
          {canMakeOffer && (
            <form
              onSubmit={createOffer}
              style={{
                padding: 16,
                borderRadius: 14,
                background: "rgba(255,255,255,0.66)",
                border: "1px solid #e0e3d4",
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: 17, margin: "0 0 14px" }}>
                Make an offer
              </h3>

              <label
                htmlFor="offer-amount"
                style={{ display: "block", fontWeight: 650, marginBottom: 6 }}
              >
                Total offer amount (₹)
              </label>
              <input
                id="offer-amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter your total offer"
                style={fieldStyle}
              />

              <label
                htmlFor="offer-quantity"
                style={{ display: "block", fontWeight: 650, margin: "12px 0 6px" }}
              >
                Quantity
              </label>
              <input
                id="offer-quantity"
                type="number"
                min="0.001"
                step="0.001"
                inputMode="decimal"
                required
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                style={fieldStyle}
              />

              <button type="submit" disabled={busy} style={primaryButton}>
                {busy ? "Submitting…" : "Submit offer"}
              </button>
            </form>
          )}

          {userId && isSeller && (
            <p style={{ marginBottom: 16, color: "#526456" }}>
              You are viewing your own listing. Buyer offers and replies will
              appear here.
            </p>
          )}

          {userId && !isSeller && !isActive && (
            <p style={{ marginBottom: 16, color: "#526456" }}>
              This listing is not currently active, so new offers are
              unavailable.
            </p>
          )}

          {userId && !isSeller && isActive && latestPending && (
            <p style={{ marginBottom: 16, color: "#526456" }}>
              There is already a pending offer on this listing. Respond to
              the current negotiation before starting another one.
            </p>
          )}

          {offers.length === 0 ? (
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "rgba(255,255,255,0.55)",
              }}
            >
              No offers yet. When a buyer submits an offer, the negotiation
              history will appear here.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <h3 style={{ fontSize: 17, margin: "0 0 2px" }}>
                Negotiation history
              </h3>

              {offers.map((offer, index) => {
                const isCreator = userId === offer.created_by;
                const isBuyer = userId === offer.buyer_id;
                const isRecipient = userId !== offer.created_by;
                const isPending = offer.status === "pending";
                const notExpired =
                  new Date(offer.expires_at).getTime() > Date.now();
                const canRespond =
                  Boolean(userId) &&
                  isActive &&
                  isPending &&
                  notExpired &&
                  (isBuyer || isSeller);

                return (
                  <article
                    key={offer.id}
                    style={{
                      padding: 15,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.76)",
                      border: "1px solid #e0e3d4",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong>Offer round {index + 1}</strong>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: "5px 9px",
                          borderRadius: 20,
                          background:
                            offer.status === "accepted"
                              ? "#dcefe0"
                              : offer.status === "pending"
                                ? "#f5edce"
                                : "#e8ebe4",
                        }}
                      >
                        {statusLabel[offer.status] ?? offer.status}
                      </span>
                    </div>

                    <p style={{ fontSize: 22, fontWeight: 750, margin: "12px 0 4px" }}>
                      {money(offer.amount)}
                    </p>
                    <p style={{ margin: "0 0 8px", color: "#526456" }}>
                      Quantity: {offer.quantity}
                    </p>
                    
                    <p style={{ fontSize: 12, color: "#687568", margin: "8px 0" }}>
                      {isCreator
                        ? "Submitted by you"
                        : isBuyer
                          ? "Submitted by the seller"
                          : "Submitted by the buyer"}{" "}
                      · {dateLabel(offer.created_at)}
                    </p>

                    {canRespond && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 12,
                        }}
                      >
                        {isRecipient && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void respond(offer, "accept")}
                            style={primaryButton}
                          >
                            Accept offer
                          </button>
                        )}

                        {isSeller && isBuyer && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void respond(offer, "decline")}
                            style={secondaryButton}
                          >
                            Decline
                          </button>
                        )}

                        {isCreator && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void respond(offer, "withdraw")}
                            style={secondaryButton}
                          >
                            Withdraw
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setCounterFor(
                              counterFor === offer.id ? null : offer.id
                            );
                            setCounterAmount(String(offer.amount));
                            setCounterQuantity(String(offer.quantity));
                            setError("");
                          }}
                          style={secondaryButton}
                        >
                          Counteroffer
                        </button>
                      </div>
                    )}

                    {counterFor === offer.id && canRespond && (
                      <form
                        onSubmit={(event) => submitCounter(event, offer)}
                        style={{
                          marginTop: 14,
                          paddingTop: 14,
                          borderTop: "1px solid #e0e3d4",
                        }}
                      >
                        <h4 style={{ margin: "0 0 10px" }}>Your counteroffer</h4>

                        <label
                          htmlFor={`counter-amount-${offer.id}`}
                          style={{ display: "block", fontWeight: 650, marginBottom: 6 }}
                        >
                          Total amount (₹)
                        </label>
                        <input
                          id={`counter-amount-${offer.id}`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          inputMode="decimal"
                          required
                          value={counterAmount}
                          onChange={(event) =>
                            setCounterAmount(event.target.value)
                          }
                          style={fieldStyle}
                        />

                        <label
                          htmlFor={`counter-quantity-${offer.id}`}
                          style={{ display: "block", fontWeight: 650, margin: "12px 0 6px" }}
                        >
                          Quantity
                        </label>
                        <input
                          id={`counter-quantity-${offer.id}`}
                          type="number"
                          min="0.001"
                          step="0.001"
                          inputMode="decimal"
                          required
                          value={counterQuantity}
                          onChange={(event) =>
                            setCounterQuantity(event.target.value)
                          }
                          style={fieldStyle}
                        />

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button type="submit" disabled={busy} style={primaryButton}>
                            {busy ? "Submitting…" : "Send counteroffer"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCounterFor(null)}
                            style={secondaryButton}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: "#687568",
              margin: "18px 0 0",
            }}
          >
            Important: accepting an offer records agreement only. Payment,
            delivery and paid-order confirmation are not connected to this
            negotiation feature yet.
          </p>
        </>
      )}
    </section>
  );
}

const fieldStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #cbd5c7",
  borderRadius: 10,
  background: "#fffef9",
  color: "#173c2a",
  fontSize: 16,
};

const primaryButton: React.CSSProperties = {
  border: "none",
  borderRadius: 10,
  padding: "11px 15px",
  background: "#173c2a",
  color: "#fffdf5",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid #b9c8b8",
  borderRadius: 10,
  padding: "10px 13px",
  background: "#fffdf5",
  color: "#173c2a",
  fontWeight: 650,
  cursor: "pointer",
};
