"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type Listing = {
  id: string;
  title: string;
};

type BuyerOption = {
  key: string;
  postId: string;
  buyerId: string;
  buyerName: string;
};

function localDateTimeValue(date: Date) {
  const adjusted = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return adjusted.toISOString().slice(0, 16);
}

const palette = {
  forest: "#173c2a",
  deepForest: "#102d20",
  green: "#176747",
  ivory: "#fffdf5",
  muted: "#647367",
  gold: "#d8c18a",
};

export default function NewQuotePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [listings, setListings] = useState<Listing[]>([]);
  const [buyers, setBuyers] = useState<BuyerOption[]>([]);
  const [postId, setPostId] = useState("");
  const [buyerKey, setBuyerKey] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [expiresAt, setExpiresAt] = useState(() =>
    localDateTimeValue(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    )
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const eligibleBuyers = buyers.filter(
    (buyer) => buyer.postId === postId
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      setLoading(true);
      setMessage("");

      const { data: auth, error: authError } =
        await supabase.auth.getUser();

      if (authError || !auth.user) {
        router.replace("/auth");
        return;
      }

      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("id,title")
        .eq("owner_id", auth.user.id)
        .eq("type", "have")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (postError) {
        if (!cancelled) {
          setMessage("Unable to load your listings: " + postError.message);
          setLoading(false);
        }
        return;
      }

      const ownedListings = (postData ?? []) as Listing[];

      if (ownedListings.length === 0) {
        if (!cancelled) {
          setListings([]);
          setBuyers([]);
          setLoading(false);
        }
        return;
      }

      const postIds = ownedListings.map((post) => post.id);

      const { data: conversationData, error: conversationError } =
        await supabase
          .from("conversations")
          .select("id,post_id")
          .in("post_id", postIds);

      if (conversationError) {
        if (!cancelled) {
          setMessage(
            "Unable to load buyer conversations: " +
              conversationError.message
          );
          setLoading(false);
        }
        return;
      }

      const conversations = (conversationData ?? []) as {
        id: string;
        post_id: string | null;
      }[];

      if (conversations.length === 0) {
        if (!cancelled) {
          setListings(ownedListings);
          setBuyers([]);
          setLoading(false);
        }
        return;
      }

      const conversationIds = conversations.map((item) => item.id);

      const { data: membershipData, error: membershipError } =
        await supabase
          .from("conversation_members")
          .select("conversation_id,user_id")
          .in("conversation_id", conversationIds);

      if (membershipError) {
        if (!cancelled) {
          setMessage(
            "Unable to load conversation members: " +
              membershipError.message
          );
          setLoading(false);
        }
        return;
      }

      const memberships = (membershipData ?? []) as {
        conversation_id: string;
        user_id: string;
      }[];

      const otherUserIds = Array.from(
        new Set(
          memberships
            .map((member) => member.user_id)
            .filter((id) => id !== auth.user.id)
        )
      );

      let profileRows: { id: string; full_name: string | null }[] = [];

      if (otherUserIds.length > 0) {
        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("id,full_name")
            .in("id", otherUserIds);

        if (profileError) {
          if (!cancelled) {
            setMessage(
              "Unable to load buyer names: " + profileError.message
            );
            setLoading(false);
          }
          return;
        }

        profileRows = (profileData ?? []) as {
          id: string;
          full_name: string | null;
        }[];
      }

      const profileNames = new Map(
        profileRows.map((profile) => [
          profile.id,
          profile.full_name?.trim() || "NagaSphere buyer",
        ])
      );

      const buyerOptions: BuyerOption[] = [];

      for (const conversation of conversations) {
        if (!conversation.post_id) continue;

        const members = memberships.filter(
          (member) =>
            member.conversation_id === conversation.id
        );

        const otherMembers = members.filter(
          (member) => member.user_id !== auth.user.id
        );

        for (const member of otherMembers) {
          buyerOptions.push({
            key: `${conversation.id}:${member.user_id}`,
            postId: conversation.post_id,
            buyerId: member.user_id,
            buyerName:
              profileNames.get(member.user_id) ??
              "NagaSphere buyer",
          });
        }
      }

      const uniqueBuyers = Array.from(
        new Map(
          buyerOptions.map((buyer) => [buyer.key, buyer])
        ).values()
      );

      if (!cancelled) {
        setListings(ownedListings);
        setBuyers(uniqueBuyers);
        setPostId(ownedListings[0]?.id ?? "");
        setLoading(false);
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  function handleListingChange(value: string) {
    setPostId(value);
    setBuyerKey("");
    setMessage("");
    setSuccess(false);
  }

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    const selectedBuyer = eligibleBuyers.find(
      (buyer) => buyer.key === buyerKey
    );

    const numericAmount = Number(amount);

    if (!postId) {
      setMessage("Please select one of your active offer listings.");
      return;
    }

    if (!selectedBuyer) {
      setMessage(
        "Please select a buyer who has a conversation about this listing."
      );
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Enter a valid quote amount greater than ₹0.");
      return;
    }

    if (numericAmount > 100000000) {
      setMessage("The quote amount is above the allowed limit.");
      return;
    }

    if (note.trim().length > 1000) {
      setMessage("Your note must be 1,000 characters or fewer.");
      return;
    }

    const expiryDate = new Date(expiresAt);
    const now = Date.now();
    const maxExpiry = now + 30 * 24 * 60 * 60 * 1000;

    if (
      !expiresAt ||
      Number.isNaN(expiryDate.getTime()) ||
      expiryDate.getTime() <= now ||
      expiryDate.getTime() > maxExpiry
    ) {
      setMessage(
        "Choose an expiry time in the future, within the next 30 days."
      );
      return;
    }

    setSaving(true);

    try {
      const { data: auth, error: authError } =
        await supabase.auth.getUser();

      if (authError || !auth.user) {
        router.replace("/auth");
        return;
      }

      const { data: quoteId, error: quoteError } =
        await supabase.rpc("create_quote", {
          p_post_id: postId,
          p_buyer_id: selectedBuyer.buyerId,
          p_amount: numericAmount,
          p_note: note.trim() || null,
          p_expires_at: expiryDate.toISOString(),
        });

      if (quoteError) {
        setMessage(
          "The quote could not be created: " + quoteError.message
        );
        return;
      }

      if (!quoteId) {
        setMessage(
          "The database did not return a quote reference. Please check before trying again."
        );
        return;
      }

      setSuccess(true);
      setMessage("Quote created successfully.");
      setAmount("");
      setNote("");
      setBuyerKey("");
      router.refresh();
    } catch {
      setMessage(
        "Something went wrong while creating the quote. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const cardStyle = {
    background:
      "linear-gradient(145deg, rgba(255,253,245,0.97), rgba(239,242,227,0.94))",
    border: "1px solid rgba(255,255,255,0.78)",
    borderRadius: 22,
    boxShadow: "0 18px 42px rgba(4,24,14,0.2)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  } as const;

  const inputStyle = {
    display: "block",
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "13px 14px",
    borderRadius: 12,
    border: "1px solid rgba(23,60,42,0.2)",
    background: "rgba(255,255,255,0.84)",
    color: palette.deepForest,
    fontSize: 14,
    outlineColor: palette.green,
  };

  const labelStyle = {
    display: "block",
    marginBottom: 7,
    color: palette.forest,
    fontSize: 13,
    fontWeight: 700,
  } as const;

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        padding: "24px 14px 48px",
        boxSizing: "border-box",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: palette.deepForest,
      }}
    >
      <div style={{ width: "100%", maxWidth: 760, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 18,
            background:
              "linear-gradient(115deg, #102d21, #174331 52%, #0b241a)",
            border: "1px solid rgba(207,176,105,0.72)",
            boxShadow: "0 12px 28px rgba(5,25,15,0.24)",
          }}
        >
          <Link href="/" aria-label="NagaSphere home">
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                display: "block",
                width: "clamp(110px, 30vw, 145px)",
                maxHeight: 54,
                objectFit: "contain",
              }}
            />
          </Link>

          <Link
            href="/messages"
            style={{
              color: "#fffdf5",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 700,
              padding: "10px 13px",
              border: "1px solid rgba(216,193,138,0.55)",
              borderRadius: 999,
            }}
          >
            Messages
          </Link>
        </header>

        <section
          style={{
            marginTop: 22,
            padding: "clamp(22px, 5vw, 36px)",
            borderRadius: 24,
            color: palette.ivory,
            background:
              "radial-gradient(ellipse at 90% 0%, rgba(216,193,138,0.2), transparent 38%), linear-gradient(135deg, #214b35, #10291e 62%, #091d15)",
            border: "1px solid rgba(255,255,255,0.17)",
            boxShadow: "0 18px 40px rgba(5,25,15,0.25)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: palette.gold,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Seller tools
          </p>

          <h1
            style={{
              margin: "12px 0 10px",
              fontSize: "clamp(28px, 6vw, 40px)",
              lineHeight: 1.15,
              letterSpacing: -0.8,
            }}
          >
            Create a quote
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 560,
              color: "rgba(255,253,245,0.82)",
              fontSize: 14,
              lineHeight: 1.75,
            }}
          >
            Send a clear price offer to a buyer you are already
            discussing a listing with.
          </p>
        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: 18,
            padding: "clamp(18px, 4vw, 30px)",
          }}
        >
          {loading ? (
            <p style={{ color: palette.muted }}>
              Preparing your quote form...
            </p>
          ) : listings.length === 0 ? (
            <div>
              <h2 style={{ marginTop: 0, fontSize: 20 }}>
                No active offer listings yet
              </h2>
              <p style={{ color: palette.muted, lineHeight: 1.7 }}>
                Create an offer listing first. You can then prepare a quote
                for a buyer who contacts you about it.
              </p>
              <Link
                href="/create-listing"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: palette.forest,
                  color: palette.ivory,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Create a listing
              </Link>
            </div>
          ) : (
            <form onSubmit={submitQuote}>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="quote-listing" style={labelStyle}>
                  Your active listing
                </label>
                <select
                  id="quote-listing"
                  value={postId}
                  onChange={(event) =>
                    handleListingChange(event.target.value)
                  }
                  style={inputStyle}
                  required
                >
                  {listings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="quote-buyer" style={labelStyle}>
                  Buyer
                </label>
                <select
                  id="quote-buyer"
                  value={buyerKey}
                  onChange={(event) => setBuyerKey(event.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Choose a buyer conversation</option>
                  {eligibleBuyers.map((buyer) => (
                    <option key={buyer.key} value={buyer.key}>
                      {buyer.buyerName}
                    </option>
                  ))}
                </select>

                {eligibleBuyers.length === 0 && (
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: palette.muted,
                      fontSize: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    No buyer conversation was found for this listing.
                    Open Messages and start or continue the conversation
                    about this listing first.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="quote-amount" style={labelStyle}>
                  Quote amount (₹)
                </label>
                <input
                  id="quote-amount"
                  type="number"
                  min="0.01"
                  max="100000000"
                  step="0.01"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter your price"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="quote-note" style={labelStyle}>
                  Note (optional)
                </label>
                <textarea
                  id="quote-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add details about the price, quantity, or terms..."
                  maxLength={1000}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                />
                <p
                  style={{
                    margin: "6px 0 0",
                    textAlign: "right",
                    color: palette.muted,
                    fontSize: 11,
                  }}
                >
                  {note.length}/1000
                </p>
              </div>

              <div style={{ marginBottom: 22 }}>
                <label htmlFor="quote-expiry" style={labelStyle}>
                  Quote expires
                </label>
                <input
                  id="quote-expiry"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                  style={inputStyle}
                  required
                />
                <p
                  style={{
                    margin: "7px 0 0",
                    color: palette.muted,
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  Choose a future date within the next 30 days.
                </p>
              </div>

              {message && (
                <p
                  role="status"
                  style={{
                    margin: "0 0 18px",
                    padding: 13,
                    borderRadius: 12,
                    background: success
                      ? "rgba(23,103,71,0.09)"
                      : "rgba(150,55,35,0.08)",
                    border: success
                      ? "1px solid rgba(23,103,71,0.22)"
                      : "1px solid rgba(150,55,35,0.2)",
                    color: success ? palette.green : "#963723",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving || eligibleBuyers.length === 0}
                style={{
                  width: "100%",
                  minHeight: 49,
                  padding: "13px 18px",
                  border: "1px solid rgba(216,193,138,0.7)",
                  borderRadius: 13,
                  background:
                    saving || eligibleBuyers.length === 0
                      ? "#718276"
                      : "linear-gradient(135deg, #214c36, #10291e)",
                  color: "#fffdf5",
                  fontSize: 14,
                  fontWeight: 750,
                  cursor:
                    saving || eligibleBuyers.length === 0
                      ? "not-allowed"
                      : "pointer",
                  boxShadow: "0 7px 18px rgba(23,60,42,0.16)",
                }}
              >
                {saving ? "Creating quote..." : "Create quote"}
              </button>

              <p
                style={{
                  margin: "14px 0 0",
                  color: palette.muted,
                  fontSize: 11,
                  lineHeight: 1.7,
                  textAlign: "center",
                }}
              >
                This creates a quote only. It does not collect payment or
                create an order.
              </p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
