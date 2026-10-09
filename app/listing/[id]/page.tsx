"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type Listing = {
  id: string;
  owner_id: string;
  type: string;
  title: string;
  description: string | null;
  quantity: number | string | null;
  unit: string | null;
  budget_min: number | string | null;
  budget_max: number | string | null;
  city: string | null;
  state: string | null;
  category_id: string | null;
  status: string;
};

type Category = {
  id: string;
  name: string;
};

type Seller = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

const supabase = createClient();

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);

  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadListing() {
      if (!id) return;

      setLoading(true);
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const listingQuery = supabase
        .from("posts")
        .select(
          "id, owner_id, type, title, description, quantity, unit, budget_min, budget_max, city, state, category_id, status"
        )
        .eq("id", id);

      const { data: listingData, error: listingError } = user
        ? await listingQuery.maybeSingle()
        : await listingQuery.eq("status", "active").maybeSingle();

      if (listingError) {
        console.error("Listing load error:", listingError);
        setMessage("Unable to load this listing.");
        setLoading(false);
        return;
      }

      if (!listingData) {
        setMessage("This listing is no longer available.");
        setLoading(false);
        return;
      }

      setListing(listingData);

      if (listingData.category_id) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("id, name")
          .eq("id", listingData.category_id)
          .maybeSingle();

        setCategory(categoryData);
      }

      const { data: sellerData } = await supabase
        .from("public_seller_profiles")
        .select("id, full_name, avatar_url")
        .eq("id", listingData.owner_id)
        .maybeSingle();

      setSeller(sellerData);

      setLoading(false);
    }

    loadListing();
  }, [id]);

  async function contactSeller() {
    if (!listing || contacting) return;

    setMessage("");
    setContacting(true);

    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError) {
        console.error("Auth session error:", authError);
        setMessage("Unable to verify your account. Please try again.");
        return;
      }

      const user = session?.user;

      if (!user) {
        router.push("/auth");
        return;
      }

      if (user.id === listing.owner_id) {
        setMessage("You cannot contact yourself about your own listing.");
        return;
      }

      const { data: conversationId, error: conversationError } =
        await supabase.rpc("start_conversation", {
          p_post_id: listing.id,
        });

      if (conversationError) {
        console.error("Start conversation error:", conversationError);

        if (conversationError.message?.toLowerCase().includes("blocked")) {
          setMessage(
            "This conversation cannot be started because one of the users has blocked the other."
          );
        } else {
          setMessage(
            "We couldn't start the conversation right now. Please try again."
          );
        }

        return;
      }

      if (!conversationId) {
        setMessage(
          "We couldn't create the conversation. Please try again."
        );
        return;
      }

      router.push(`/messages?conversation=${conversationId}`);
    } catch (error) {
      console.error("Unexpected contact seller error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setContacting(false);
    }
  }

  const pageStyle = {
    width: "100%",
    maxWidth: "none",
    minHeight: "100vh",
    boxSizing: "border-box" as const,
    margin: 0,
    padding: "clamp(16px, 4vw, 32px)",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "900px",
    boxSizing: "border-box" as const,
    margin: "0 auto",
    border: "1px solid rgba(255,255,255,0.78)",
    borderRadius: "22px",
    padding: "clamp(20px, 4vw, 32px)",
    background:
      "linear-gradient(135deg, rgba(255,253,247,0.88), rgba(244,247,238,0.80))",
    color: "#26352a",
    boxShadow: "0 18px 48px rgba(8,30,20,0.18)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };

  const backButtonStyle = {
    display: "block",
    width: "fit-content",
    maxWidth: "900px",
    margin: "0 auto 20px",
    padding: "10px 15px",
    border: "1px solid rgba(255,255,255,0.65)",
    borderRadius: "12px",
    background: "rgba(255,253,247,0.88)",
    color: "#284333",
    boxShadow: "0 5px 18px rgba(12,35,23,0.12)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    cursor: "pointer",
    fontWeight: 650,
  };

  if (loading) {
    return (
      <main className="nagasphere-inner-page" style={pageStyle}>
        <div style={{ ...cardStyle, marginTop: "16px" }}>
          <p style={{ margin: 0 }}>Loading listing...</p>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="nagasphere-inner-page" style={pageStyle}>
        <div style={{ ...cardStyle, marginTop: "16px" }}>
          <h1 style={{ marginTop: 0 }}>Listing unavailable</h1>

          {message && (
            <p
              role="alert"
              style={{
                marginTop: "12px",
                color: "#b42318",
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="nagasphere-inner-page" style={pageStyle}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={backButtonStyle}
        >
          ← Back
        </button>

        <article style={cardStyle}>
          <header
            style={{
              padding: "0 0 22px",
              borderBottom: "1px solid rgba(66,91,68,0.18)",
              background: "transparent",
              boxShadow: "none",
              borderRadius: 0,
              position: "static",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
            }}
          >
            <p
              style={{
                display: "inline-block",
                margin: "0 0 12px",
                padding: "6px 11px",
                borderRadius: "999px",
                background: "rgba(75,101,72,0.12)",
                color: "#405b3d",
                fontWeight: 750,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontSize: "12px",
              }}
            >
              {listing.type}
            </p>

            <h1
              style={{
                margin: "0 0 12px",
                color: "#263b2c",
                fontSize: "clamp(26px, 4vw, 36px)",
                lineHeight: 1.2,
                overflowWrap: "anywhere",
              }}
            >
              {listing.title}
            </h1>

            {category && (
              <p
                style={{
                  margin: 0,
                  color: "#5b695b",
                  fontSize: "14px",
                }}
              >
                Category: {category.name}
              </p>
            )}

            {listing.status !== "active" && (
              <p
                style={{
                  display: "inline-block",
                  margin: "14px 0 0",
                  padding: "7px 11px",
                  borderRadius: "8px",
                  background: "rgba(181,71,8,0.10)",
                  color: "#9a4310",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                Status: {listing.status}
              </p>
            )}
          </header>

          {listing.description && (
            <section style={{ marginTop: "25px" }}>
              <h2
                style={{
                  margin: "0 0 10px",
                  color: "#304c35",
                  fontSize: "19px",
                }}
              >
                Description
              </h2>

              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  color: "#3e4c40",
                  overflowWrap: "anywhere",
                }}
              >
                {listing.description}
              </p>
            </section>
          )}

          <section
            style={{
              marginTop: "26px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "12px",
            }}
          >
            {listing.quantity !== null && (
              <div
                style={{
                  padding: "15px",
                  borderRadius: "14px",
                  border: "1px solid rgba(66,91,68,0.13)",
                  background: "rgba(255,255,255,0.44)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    color: "#687568",
                    fontSize: "13px",
                  }}
                >
                  Quantity
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#2e4933",
                    fontWeight: 700,
                    lineHeight: 1.5,
                  }}
                >
                  {listing.quantity} {listing.unit ?? ""}
                </p>
              </div>
            )}

            {(listing.budget_min !== null ||
              listing.budget_max !== null) && (
              <div
                style={{
                  padding: "15px",
                  borderRadius: "14px",
                  border: "1px solid rgba(66,91,68,0.13)",
                  background: "rgba(255,255,255,0.44)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    color: "#687568",
                    fontSize: "13px",
                  }}
                >
                  Budget
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#2e4933",
                    fontWeight: 700,
                    lineHeight: 1.5,
                  }}
                >
                  {listing.budget_min !== null
                    ? `₹${listing.budget_min}`
                    : ""}
                  {listing.budget_min !== null &&
                  listing.budget_max !== null
                    ? " – "
                    : ""}
                  {listing.budget_max !== null
                    ? `₹${listing.budget_max}`
                    : ""}
                </p>
              </div>
            )}

            {(listing.city || listing.state) && (
              <div
                style={{
                  padding: "15px",
                  borderRadius: "14px",
                  border: "1px solid rgba(66,91,68,0.13)",
                  background: "rgba(255,255,255,0.44)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    color: "#687568",
                    fontSize: "13px",
                  }}
                >
                  Location
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#2e4933",
                    fontWeight: 700,
                    lineHeight: 1.5,
                  }}
                >
                  {[listing.city, listing.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
          </section>

          <section
            style={{
              marginTop: "30px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(66,91,68,0.18)",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#304c35",
                fontSize: "19px",
              }}
            >
              Seller
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginTop: "15px",
                padding: "15px",
                borderRadius: "15px",
                background: "rgba(255,255,255,0.48)",
                border: "1px solid rgba(66,91,68,0.12)",
              }}
            >
              {seller?.avatar_url ? (
                <img
                  src={seller.avatar_url}
                  alt={seller.full_name ?? "Seller"}
                  width={52}
                  height={52}
                  style={{
                    flexShrink: 0,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(255,255,255,0.9)",
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  style={{
                    width: "52px",
                    height: "52px",
                    flexShrink: 0,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #dfe8d9, #f5f1e6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 750,
                    fontSize: "19px",
                    color: "#405b3d",
                  }}
                >
                  {(seller?.full_name?.charAt(0) ?? "S").toUpperCase()}
                </div>
              )}

              <div style={{ minWidth: 0 }}>
                <strong
                  style={{
                    display: "block",
                    color: "#2e4933",
                    overflowWrap: "anywhere",
                  }}
                >
                  {seller?.full_name || "NagaSphere Seller"}
                </strong>
                <span
                  style={{
                    display: "block",
                    marginTop: "4px",
                    color: "#687568",
                    fontSize: "13px",
                  }}
                >
                  NagaSphere marketplace seller
                </span>
              </div>
            </div>
          </section>

          <div style={{ marginTop: "28px" }}>
            <button
              type="button"
              onClick={contactSeller}
              disabled={contacting || listing.status !== "active"}
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 18px",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "13px",
                background:
                  contacting || listing.status !== "active"
                    ? "#899482"
                    : "linear-gradient(135deg, #405b3d, #294832)",
                color: "#fff",
                fontWeight: 750,
                fontSize: "15px",
                boxShadow:
                  contacting || listing.status !== "active"
                    ? "none"
                    : "0 8px 20px rgba(41,72,50,0.22)",
                cursor:
                  contacting || listing.status !== "active"
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {listing.status !== "active"
                ? "Listing Not Active"
                : contacting
                  ? "Opening conversation..."
                  : "Contact Seller"}
            </button>

            {message && (
              <p
                role="alert"
                style={{
                  marginTop: "12px",
                  color: "#b42318",
                  lineHeight: 1.6,
                  overflowWrap: "anywhere",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
