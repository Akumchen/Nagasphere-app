
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

const colors = {
  green: "#173b2b",
  deepGreen: "#10291e",
  muted: "#637267",
  border: "rgba(255,255,255,0.68)",
  glass: "rgba(250,249,241,0.91)",
  softGlass: "rgba(250,249,241,0.82)",
};

const buttonStyle: React.CSSProperties = {
  border: "1px solid rgba(31,65,47,0.20)",
  background: "rgba(255,255,255,0.76)",
  color: colors.green,
  padding: "10px 15px",
  borderRadius: "11px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  minHeight: "42px",
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

      const [
        { data: listingData, error: listingError },
        { data: categoryData },
      ] = await Promise.all([
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
        className="nagasphere-inner-page"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          color: "#fffdf4",
          fontSize: "16px",
          fontWeight: 600,
        }}
      >
        Loading your listings...
      </main>
    );
  }

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        padding: "clamp(14px, 3.5vw, 34px) clamp(12px, 3vw, 24px) 48px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            background: "rgba(246,247,236,0.91)",
            border: "1px solid rgba(255,255,255,0.78)",
            borderRadius: "18px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            boxShadow: "0 12px 34px rgba(5,25,15,0.19)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
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
              minWidth: 0,
            }}
          >
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                width: "clamp(120px, 30vw, 158px)",
                maxWidth: "100%",
                height: "auto",
                maxHeight: "58px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={{
              ...buttonStyle,
              background: colors.green,
              borderColor: colors.green,
              color: "#fffdf4",
              padding: "10px 17px",
            }}
          >
            ← Dashboard
          </button>
        </header>

        <section
          style={{
            marginTop: "24px",
            padding: "clamp(22px, 5vw, 36px)",
            borderRadius: "22px",
            border: `1px solid ${colors.border}`,
            background:
              "linear-gradient(135deg, rgba(250,249,241,0.96), rgba(238,241,225,0.88))",
            boxShadow: "0 18px 46px rgba(5,25,15,0.17)",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(31,65,47,0.15)",
              background: "rgba(255,255,255,0.64)",
              borderRadius: "999px",
              padding: "7px 12px",
              color: colors.green,
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            <span aria-hidden="true">✦</span>
            Your marketplace
          </div>

          <h1
            style={{
              margin: "16px 0 8px",
              color: colors.deepGreen,
              fontSize: "clamp(29px, 6vw, 43px)",
              lineHeight: 1.12,
              letterSpacing: "-1.2px",
              fontWeight: 750,
            }}
          >
            My Listings
          </h1>

          <p
            style={{
              margin: 0,
              color: colors.muted,
              lineHeight: 1.7,
              fontSize: "15px",
              maxWidth: "590px",
            }}
          >
            Everything you offer or need, gathered in one place.
            Manage your products and services across Nagaland.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => router.push("/create-listing")}
              style={{
                border: "1px solid #173b2b",
                background:
                  "linear-gradient(135deg, #214c36, #112e21)",
                color: "#fffdf4",
                padding: "13px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 7px 17px rgba(23,59,43,0.20)",
                minHeight: "46px",
              }}
            >
              + Create Listing
            </button>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: colors.green,
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(31,65,47,0.12)",
                borderRadius: "12px",
                padding: "12px 15px",
                fontSize: "13px",
                fontWeight: 650,
                minHeight: "46px",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: "17px" }}>▤</span>
              {listings.length}{" "}
              {listings.length === 1 ? "listing" : "listings"}
            </div>
          </div>
        </section>

        {message && (
          <div
            role="alert"
            style={{
              marginTop: "18px",
              color: "#762b22",
              background: "rgba(255,244,239,0.96)",
              border: "1px solid rgba(160,60,42,0.2)",
              padding: "15px 17px",
              borderRadius: "13px",
              overflowWrap: "anywhere",
              boxShadow: "0 8px 22px rgba(5,25,15,0.10)",
            }}
          >
            {message}
          </div>
        )}

        <section
          aria-label="Your listings"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "17px",
            marginTop: "22px",
          }}
        >
          {listings.length === 0 ? (
            <div
              style={{
                background: colors.glass,
                padding: "clamp(23px, 5vw, 36px)",
                borderRadius: "20px",
                border: `1px solid ${colors.border}`,
                boxShadow: "0 14px 35px rgba(5,25,15,0.16)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: "50px",
                  height: "50px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "15px",
                  background: "rgba(31,65,47,0.09)",
                  color: colors.green,
                  fontSize: "25px",
                  marginBottom: "17px",
                }}
              >
                ◇
              </div>
              <h2
                style={{
                  margin: "0 0 9px",
                  color: colors.deepGreen,
                  fontSize: "23px",
                }}
              >
                No listings yet
              </h2>
              <p
                style={{
                  color: colors.muted,
                  lineHeight: 1.7,
                  margin: "0 0 20px",
                }}
              >
                Create your first listing to start reaching customers
                across Nagaland.
              </p>
              <button
                type="button"
                onClick={() => router.push("/create-listing")}
                style={{
                  ...buttonStyle,
                  background: colors.green,
                  borderColor: colors.green,
                  color: "#fffdf4",
                }}
              >
                Create your first listing →
              </button>
            </div>
          ) : (
            listings.map((listing) => {
              const statusLabel =
                listing.status === "active"
                  ? "Active"
                  : listing.status === "paused"
                    ? "Paused"
                    : listing.status === "closed"
                      ? "Closed"
                      : listing.status;

              const statusColors =
                listing.status === "active"
                  ? {
                      background: "rgba(37,112,66,0.11)",
                      color: "#21643a",
                      border: "rgba(37,112,66,0.18)",
                    }
                  : listing.status === "paused"
                    ? {
                        background: "rgba(164,113,25,0.11)",
                        color: "#805714",
                        border: "rgba(164,113,25,0.19)",
                      }
                    : {
                        background: "rgba(94,101,94,0.11)",
                        color: "#5d655e",
                        border: "rgba(94,101,94,0.18)",
                      };

              return (
                <article
                  key={listing.id}
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(250,249,242,0.96), rgba(239,242,229,0.91))",
                    padding: "clamp(19px, 4vw, 28px)",
                    borderRadius: "20px",
                    border: `1px solid ${colors.border}`,
                    boxShadow: "0 13px 32px rgba(5,25,15,0.17)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    minWidth: 0,
                    overflowWrap: "anywhere",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div style={{ flex: "1 1 210px", minWidth: 0 }}>
                      <div
                        style={{
                          color: colors.muted,
                          fontSize: "11px",
                          fontWeight: 750,
                          letterSpacing: "1.1px",
                          textTransform: "uppercase",
                          marginBottom: "9px",
                        }}
                      >
                        {getCategoryName(listing.category_id)}
                      </div>

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
                          maxWidth: "100%",
                        }}
                      >
                        <h2
                          style={{
                            margin: 0,
                            color: colors.deepGreen,
                            fontSize: "clamp(20px, 4vw, 26px)",
                            lineHeight: 1.3,
                            letterSpacing: "-0.4px",
                            fontWeight: 750,
                          }}
                        >
                          {listing.title}
                        </h2>
                      </button>
                    </div>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        border: `1px solid ${statusColors.border}`,
                        background: statusColors.background,
                        color: statusColors.color,
                        padding: "7px 11px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 750,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: statusColors.color,
                        }}
                      />
                      {statusLabel}
                    </span>
                  </div>

                  {listing.description && (
                    <p
                      style={{
                        color: colors.muted,
                        lineHeight: 1.75,
                        fontSize: "14px",
                        margin: "14px 0 18px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {listing.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
                      gap: "10px",
                      marginTop: listing.description ? "0" : "17px",
                    }}
                  >
                    <div
                      style={{
                        padding: "13px 14px",
                        borderRadius: "13px",
                        background: "rgba(255,255,255,0.58)",
                        border: "1px solid rgba(31,65,47,0.09)",
                      }}
                    >
                      <div
                        style={{
                          color: colors.muted,
                          fontSize: "11px",
                          fontWeight: 750,
                          letterSpacing: "0.7px",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                        }}
                      >
                        Listing type
                      </div>
                      <div
                        style={{
                          color: colors.green,
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        {listing.type === "have" ? "I Have" : "I Need"}
                      </div>
                    </div>

                    {listing.quantity !== null && (
                      <div
                        style={{
                          padding: "13px 14px",
                          borderRadius: "13px",
                          background: "rgba(255,255,255,0.58)",
                          border: "1px solid rgba(31,65,47,0.09)",
                        }}
                      >
                        <div
                          style={{
                            color: colors.muted,
                            fontSize: "11px",
                            fontWeight: 750,
                            letterSpacing: "0.7px",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                          }}
                        >
                          Quantity
                        </div>
                        <div
                          style={{
                            color: colors.green,
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          {listing.quantity} {listing.unit ?? ""}
                        </div>
                      </div>
                    )}

                    {listing.budget_min !== null && (
                      <div
                        style={{
                          padding: "13px 14px",
                          borderRadius: "13px",
                          background: "rgba(255,255,255,0.58)",
                          border: "1px solid rgba(31,65,47,0.09)",
                        }}
                      >
                        <div
                          style={{
                            color: colors.muted,
                            fontSize: "11px",
                            fontWeight: 750,
                            letterSpacing: "0.7px",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                          }}
                        >
                          Price / budget
                        </div>
                        <div
                          style={{
                            color: colors.green,
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          ₹{listing.budget_min}
                          {listing.budget_max !== null &&
                          listing.budget_max !== listing.budget_min
                            ? ` – ₹${listing.budget_max}`
                            : ""}
                        </div>
                      </div>
                    )}

                    {(listing.city || listing.state) && (
                      <div
                        style={{
                          padding: "13px 14px",
                          borderRadius: "13px",
                          background: "rgba(255,255,255,0.58)",
                          border: "1px solid rgba(31,65,47,0.09)",
                        }}
                      >
                        <div
                          style={{
                            color: colors.muted,
                            fontSize: "11px",
                            fontWeight: 750,
                            letterSpacing: "0.7px",
                            textTransform: "uppercase",
                            marginBottom: "6px",
                          }}
                        >
                          Location
                        </div>
                        <div
                          style={{
                            color: colors.green,
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          {listing.city ?? ""}
                          {listing.city && listing.state ? ", " : ""}
                          {listing.state ?? ""}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      height: "1px",
                      background: "rgba(31,65,47,0.12)",
                      margin: "21px 0 17px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "9px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/edit-listing/${listing.id}`)
                      }
                      style={buttonStyle}
                    >
                      Edit
                    </button>

                    {listing.status === "active" ? (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(listing.id, "paused")
                        }
                        style={buttonStyle}
                      >
                        Pause
                      </button>
                    ) : listing.status === "paused" ? (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(listing.id, "active")
                        }
                        style={buttonStyle}
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
                        style={buttonStyle}
                      >
                        Reopen
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          updateStatus(listing.id, "closed")
                        }
                        style={buttonStyle}
                      >
                        Close
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteListing(listing.id)}
                      style={{
                        ...buttonStyle,
                        color: "#913b30",
                        borderColor: "rgba(145,59,48,0.22)",
                        background: "rgba(255,247,243,0.76)",
                      }}
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/listing/${listing.id}`)
                      }
                      style={{
                        ...buttonStyle,
                        marginLeft: "auto",
                        background: "rgba(31,65,47,0.08)",
                      }}
                    >
                      View listing →
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
