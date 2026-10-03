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

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <p>Loading listing...</p>
      </main>
    );
  }

  if (!listing) {
    return (
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <h1>Listing unavailable</h1>

        {message && (
          <p
            style={{
              marginTop: "12px",
              color: "#b42318",
            }}
          >
            {message}
          </p>
        )}
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <button
        type="button"
        onClick={() => router.back()}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "24px",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#59674f",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "13px",
              }}
            >
              {listing.type}
            </p>

            <h1
              style={{
                marginTop: "8px",
                marginBottom: "12px",
              }}
            >
              {listing.title}
            </h1>

            {category && (
              <p
                style={{
                  margin: 0,
                  color: "#666",
                }}
              >
                Category: {category.name}
              </p>
            )}

            {listing.status !== "active" && (
              <p
                style={{
                  marginTop: "10px",
                  color: "#b54708",
                  fontWeight: 700,
                }}
              >
                Status: {listing.status}
              </p>
            )}
          </div>
        </div>

        {listing.description && (
          <section style={{ marginTop: "24px" }}>
            <h2>Description</h2>

            <p
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {listing.description}
            </p>
          </section>
        )}

        <section
          style={{
            marginTop: "24px",
            display: "grid",
            gap: "10px",
          }}
        >
          {listing.quantity !== null && (
            <p>
              <strong>Quantity:</strong> {listing.quantity}{" "}
              {listing.unit ?? ""}
            </p>
          )}

          {(listing.budget_min !== null ||
            listing.budget_max !== null) && (
            <p>
              <strong>Budget:</strong>{" "}
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
          )}

          {(listing.city || listing.state) && (
            <p>
              <strong>Location:</strong>{" "}
              {[listing.city, listing.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </section>

        <section
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid #eee",
          }}
        >
          <h2>Seller</h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            {seller?.avatar_url ? (
              <img
                src={seller.avatar_url}
                alt={seller.full_name ?? "Seller"}
                width={48}
                height={48}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#e8ece5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  color: "#59674f",
                }}
              >
                {(seller?.full_name?.charAt(0) ?? "S").toUpperCase()}
              </div>
            )}

            <div>
              <strong>
                {seller?.full_name || "NagaSphere Seller"}
              </strong>
            </div>
          </div>
        </section>

        <div style={{ marginTop: "28px" }}>
          <button
            type="button"
            onClick={contactSeller}
            disabled={
              contacting || listing.status !== "active"
            }
            style={{
              width: "100%",
              padding: "13px 16px",
              border: "none",
              borderRadius: "10px",
              background:
                contacting || listing.status !== "active"
                  ? "#899482"
                  : "#59674f",
              color: "#fff",
              fontWeight: 700,
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
              style={{
                marginTop: "12px",
                color: "#b42318",
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
