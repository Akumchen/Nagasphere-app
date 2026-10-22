"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Quote = {
  id: string;
  post_id: string;
  seller_id: string;
  buyer_id: string;
  amount: number | string;
  currency: string;
  note: string | null;
  expires_at: string;
  created_at: string;
  status: string;
};

type QuotePanelProps = {
  conversationId: string;
  postId: string | null;
  currentUserId: string;
  otherUserId: string | null;
};

const colors = {
  forest: "#173c2a",
  green: "#176747",
  ivory: "#fffdf5",
  muted: "#647367",
  gold: "#d8c18a",
};

export default function QuotePanel({
  conversationId,
  postId,
  currentUserId,
  otherUserId,
}: QuotePanelProps) {
  const supabase = useMemo(() => createClient(), []);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadQuotes = useCallback(async () => {
    if (!postId || !currentUserId || !otherUserId) {
      setQuotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("quotes")
        .select(
          "id,post_id,seller_id,buyer_id,amount,currency,note,expires_at,created_at,status"
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const conversationQuotes = ((data ?? []) as Quote[]).filter(
        (quote) =>
          (quote.buyer_id === currentUserId &&
            quote.seller_id === otherUserId) ||
          (quote.seller_id === currentUserId &&
            quote.buyer_id === otherUserId)
      );

      setQuotes(conversationQuotes);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Unable to load quotes: ${error.message}`
          : "Unable to load quotes."
      );
    } finally {
      setLoading(false);
    }
  }, [supabase, postId, currentUserId, otherUserId]);

  useEffect(() => {
    void loadQuotes();
  }, [loadQuotes, refreshKey]);

  async function acceptQuote(quote: Quote) {
    if (acceptingId) return;

    if (quote.buyer_id !== currentUserId) {
      setMessage("Only the buyer can accept this quote.");
      return;
    }

    if (
      quote.status !== "pending" ||
      new Date(quote.expires_at).getTime() <= Date.now()
    ) {
      setMessage("This quote is no longer available for acceptance.");
      return;
    }

    const confirmed = window.confirm(
      `Accept this quote for ${quote.currency} ${Number(
        quote.amount
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}? This creates an order; it does not collect payment.`
    );

    if (!confirmed) return;

    setAcceptingId(quote.id);
    setMessage("");

    try {
      const { data, error } = await supabase.rpc(
        "create_order_from_quote",
        { p_quote_id: quote.id }
      );

      if (error) throw error;

      if (!data) {
        throw new Error(
          "No order reference was returned. Please refresh and check the quote before retrying."
        );
      }

      setMessage(
        "Quote accepted and order created. Payment has not been collected."
      );

      setRefreshKey((value) => value + 1);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Could not accept quote: ${error.message}`
          : "Could not accept this quote. Please try again."
      );
    } finally {
      setAcceptingId(null);
    }
  }

  const cardStyle = {
    border: "1px solid rgba(23,60,42,0.16)",
    borderRadius: 16,
    padding: 16,
    background:
      "linear-gradient(145deg, rgba(255,253,245,0.98), rgba(239,242,227,0.96))",
    boxShadow: "0 8px 20px rgba(4,24,14,0.08)",
    color: colors.forest,
  } as const;

  return (
    <section
      aria-label="Quotes for this conversation"
      style={{
        marginTop: 18,
        padding: 16,
        borderRadius: 20,
        border: "1px solid rgba(216,193,138,0.65)",
        background:
          "linear-gradient(135deg, rgba(16,45,32,0.97), rgba(23,60,42,0.95))",
        color: colors.ivory,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: colors.gold,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.8,
              textTransform: "uppercase",
            }}
          >
            Buyer & seller
          </p>
          <h3 style={{ margin: "6px 0 0", fontSize: 20 }}>
            Quotes & offers
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading}
          style={{
            padding: "9px 12px",
            borderRadius: 10,
            border: "1px solid rgba(216,193,138,0.6)",
            background: "transparent",
            color: colors.ivory,
            cursor: loading ? "wait" : "pointer",
            fontWeight: 700,
          }}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: "rgba(255,253,245,0.8)", marginBottom: 0 }}>
          Loading quotes...
        </p>
      ) : quotes.length === 0 ? (
        <p
          style={{
            color: "rgba(255,253,245,0.8)",
            lineHeight: 1.7,
            marginBottom: 0,
          }}
        >
          No quotes have been sent in this conversation yet. Quotes will
          appear here when available.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {quotes.map((quote) => {
            const expired =
              new Date(quote.expires_at).getTime() <= Date.now();
            const pending = quote.status === "pending" && !expired;
            const isBuyer = quote.buyer_id === currentUserId;

            return (
              <article key={quote.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color: colors.muted,
                      }}
                    >
                      {isBuyer ? "Seller's quote" : "Quote sent"}
                    </p>
                    <p
                      style={{
                        margin: "5px 0",
                        fontSize: 25,
                        fontWeight: 800,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {quote.currency}{" "}
                      {Number(quote.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 9px",
                      borderRadius: 999,
                      background: pending
                        ? "#e3efdf"
                        : "#ece9df",
                      color: colors.forest,
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "capitalize",
                    }}
                  >
                    {expired && quote.status === "pending"
                      ? "Expired"
                      : quote.status.replaceAll("_", " ")}
                  </span>
                </div>

                {quote.note ? (
                  <p
                    style={{
                      margin: "10px 0",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {quote.note}
                  </p>
                ) : null}

                <p
                  style={{
                    margin: "10px 0 0",
                    color: colors.muted,
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  Sent: {new Date(quote.created_at).toLocaleString("en-IN")}
                  <br />
                  Expires:{" "}
                  {new Date(quote.expires_at).toLocaleString("en-IN")}
                </p>

                {isBuyer && pending ? (
                  <button
                    type="button"
                    onClick={() => void acceptQuote(quote)}
                    disabled={acceptingId !== null}
                    style={{
                      width: "100%",
                      marginTop: 14,
                      padding: "13px 16px",
                      border: "none",
                      borderRadius: 12,
                      background: colors.forest,
                      color: colors.ivory,
                      fontSize: 14,
                      fontWeight: 800,
                      cursor:
                        acceptingId !== null ? "wait" : "pointer",
                      opacity: acceptingId !== null ? 0.7 : 1,
                    }}
                  >
                    {acceptingId === quote.id
                      ? "Accepting quote..."
                      : "Accept quote"}
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>
      )}

      {message ? (
        <p
          role="status"
          aria-live="polite"
          style={{
            margin: "14px 0 0",
            padding: 12,
            borderRadius: 10,
            background: "rgba(255,253,245,0.1)",
            color: colors.ivory,
            fontSize: 13,
            lineHeight: 1.6,
            overflowWrap: "anywhere",
          }}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
