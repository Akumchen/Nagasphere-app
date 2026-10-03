"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Listing = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  quantity: number | null;
  unit: string | null;
  budget_min: number | null;
  budget_max: number | null;
  city: string | null;
  state: string | null;
  status: string;
  category_id: string | null;
};

type Category = {
  id: string;
  name: string;
};

const categoryNames: Record<string, string> = {
  fresh_produce: "Fresh Produce",
  food_agriculture: "Food & Agriculture",
  food_groceries: "Food & Groceries",
  fashion: "Fashion",
  home_living: "Home & Living",
  services: "Services",
  electronics: "Electronics",
  local_businesses: "Local Businesses",
  other: "Other",
};

export default function MyListingsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadListings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      const [{ data: listingData, error: listingError }, { data: categoryData }] =
        await Promise.all([
          supabase
            .from("posts")
            .select(
              "id,title,description,type,quantity,unit,budget_min,budget_max,city,state,status,category_id"
            )
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false }),

          supabase
            .from("categories")
            .select("id,name")
            .order("name"),
        ]);

      if (listingError) {
        setMessage(listingError.message);
      } else {
        setListings(listingData ?? []);
      }

      setCategories(categoryData ?? []);
      setLoading(false);
    }

    loadListings();
  }, [router, supabase]);

  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return "Other";

    const category = categories.find(
      (item) => item.id === categoryId
    );

    if (category) return category.name;

    return categoryNames[categoryId] ?? "Other";
  }

  async function updateStatus(
    listingId: string,
    status: string
  ) {
    setMessage("");

    const { error } = await supabase
      .from("posts")
      .update({ status })
      .eq("id", listingId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setListings((current) =>
      current.map((listing) =>
        listing.id === listingId
          ? { ...listing, status }
          : listing
      )
    );
  }

  async function deleteListing(listingId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    setMessage("");

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", listingId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setListings((current) =>
      current.filter((listing) => listing.id !== listingId)
    );
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f6f7f2",
        }}
      >
        Loading your listings...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f7f2",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Go to NagaSphere home"
            style={{
              border: 0,
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                width: "170px",
                height: "auto",
                display: "block",
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={{
              border: "1px solid #d7dcd5",
              background: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
        </header>

        <section style={{ marginTop: "28px" }}>
          <h1>My Listings</h1>

          <p
            style={{
              color: "#697067",
              lineHeight: 1.5,
            }}
          >
            Manage the products and services you have listed
            on NagaSphere.
          </p>

          <button
            type="button"
            onClick={() => router.push("/listing/create")}
            style={{
              marginTop: "10px",
              border: 0,
              background: "#18251b",
              color: "white",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Create Listing
          </button>
        </section>

        {message && (
          <p
            style={{
              marginTop: "20px",
              color: "#a33",
              background: "#fff",
              padding: "14px",
              borderRadius: "10px",
            }}
          >
            {message}
          </p>
        )}

        <section
          style={{
            display: "grid",
            gap: "18px",
            marginTop: "28px",
          }}
        >
          {listings.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "28px",
                borderRadius: "18px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
              }}
            >
              <h2>No listings yet</h2>
              <p style={{ color: "#697067" }}>
                Create your first listing to start reaching
                customers across Nagaland.
              </p>
            </div>
          ) : (
            listings.map((listing) => (
              <article
                key={listing.id}
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "18px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/listing/${listing.id}`)
                  }
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "8px",
                      color: "#18251b",
                    }}
                  >
                    {listing.title}
                  </h2>
                </button>

                <p
                  style={{
                    color: "#697067",
                    marginTop: 0,
                  }}
                >
                  {listing.description}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {getCategoryName(listing.category_id)}
                </p>

                <p>
                  <strong>Type:</strong>{" "}
                  {listing.type === "have"
                    ? "I Have"
                    : "I Need"}
                </p>

                {listing.quantity !== null && (
                  <p>
                    <strong>Quantity:</strong>{" "}
                    {listing.quantity}{" "}
                    {listing.unit ?? ""}
                  </p>
                )}

                {listing.budget_min !== null && (
                  <p>
                    <strong>Price:</strong> ₹
                    {listing.budget_min}
                    {listing.budget_max !== null &&
                    listing.budget_max !== listing.budget_min
                      ? ` - ₹${listing.budget_max}`
                      : ""}
                  </p>
                )}

                {(listing.city || listing.state) && (
                  <p>
                    📍 {listing.city ?? ""}
                    {listing.city && listing.state ? ", " : ""}
                    {listing.state ?? ""}
                  </p>
                )}

                <p>
                  <strong>Status:</strong> {listing.status}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "18px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
  `/edit-listing/${listing.id}`
)
                    }
                    style={{
                      border: "1px solid #d7dcd5",
                      background: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  {listing.status === "active" ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(listing.id, "paused")
                      }
                      style={{
                        border: "1px solid #d7dcd5",
                        background: "white",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      Pause
                    </button>
                  ) : listing.status === "paused" ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(listing.id, "active")
                      }
                      style={{
                        border: "1px solid #d7dcd5",
                        background: "white",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      Resume
                    </button>
                  ) : null}

                  {listing.status === "closed" ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(listing.id, "active")
                      }
                      style={{
                        border: "1px solid #d7dcd5",
                        background: "white",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      Reopen
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(listing.id, "closed")
                      }
                      style={{
                        border: "1px solid #d7dcd5",
                        background: "white",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      deleteListing(listing.id)
                    }
                    style={{
                      border: "1px solid #d7dcd5",
                      background: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
