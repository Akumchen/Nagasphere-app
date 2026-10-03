"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Listing = {
  id: string;
  type: "have" | "need";
  title: string;
  description: string | null;
  quantity: number | null;
  unit: string | null;
  budget_min: number | null;
  city: string | null;
  state: string | null;
  category_id: string | null;
  status: "active" | "paused" | "closed" | "removed";
  created_at: string;
};

type Category = {
  id: string;
  name: string;
};

export default function MyListingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadListings() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      return;
    }

    const [{ data: postData, error: postError }, { data: categoryData }] =
      await Promise.all([
        supabase
          .from("posts")
          .select(
            "id,type,title,description,quantity,unit,budget_min,city,state,category_id,status,created_at"
          )
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),

        supabase
          .from("categories")
          .select("id,name")
          .order("name"),
      ]);

    if (postError) {
      setMessage(postError.message);
      setLoading(false);
      return;
    }

    const categoryMap: Record<string, string> = {};

    (categoryData as Category[] | null)?.forEach((category) => {
      categoryMap[category.id] = category.name;
    });

    setCategories(categoryMap);
    setListings((postData ?? []) as Listing[]);
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function changeStatus(
    id: string,
    status: "active" | "paused" | "closed"
  ) {
    setBusyId(id);
    setMessage("");

    const { data, error } = await supabase
      .from("posts")
      .update({ status })
      .eq("id", id)
      .select("id,status")
      .maybeSingle();

    if (error) {
      setMessage(error.message);
    } else if (!data) {
      setMessage(
        "The listing status was not changed. Please try again."
      );
    } else {
      setListings((current) =>
        current.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                status: data.status as Listing["status"],
              }
            : listing
        )
      );
    }

    setBusyId(null);
  }

  async function deleteListing(id: string) {
    if (!window.confirm("Delete this listing permanently?")) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
    } else {
      setListings((current) =>
        current.filter((listing) => listing.id !== id)
      );
    }

    setBusyId(null);
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 24,
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
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            marginBottom: 18,
          }}
        >
          ← Back to Dashboard
        </button>

        <header style={{ marginBottom: 24 }}>
          <h1 style={{ marginBottom: 8 }}>My Listings</h1>

          <p
            style={{
              color: "#697067",
              margin: 0,
            }}
          >
            Manage everything you have listed on NagaSphere.
          </p>
        </header>

        {message && (
          <p
            style={{
              color: "#b42318",
              marginBottom: 18,
            }}
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/create-listing")}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 20,
            border: 0,
            borderRadius: 10,
            background: "#18251b",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          + Create New Listing
        </button>

        {listings.length === 0 ? (
          <section
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <h2>No listings yet</h2>

            <p style={{ color: "#697067" }}>
              Create your first listing to start offering something locally.
            </p>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {listings.map((listing) => (
              <article
                key={listing.id}
                style={{
                  background: "#fff",
                  padding: 22,
                  borderRadius: 16,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 6px",
                        color: "#166534",
                        fontWeight: 700,
                      }}
                    >
                      {listing.type === "have" ? "I Have" : "I Need"} ·{" "}
                      {categories[listing.category_id ?? ""] ??
                        "Uncategorized"}
                    </p>

                    <h2
                      style={{
                        margin: "0 0 8px",
                      }}
                    >
                      {listing.title}
                    </h2>

                    {listing.description && (
                      <p
                        style={{
                          color: "#4b5563",
                          lineHeight: 1.5,
                        }}
                      >
                        {listing.description}
                      </p>
                    )}

                    <p
                      style={{
                        color: "#697067",
                        marginBottom: 0,
                      }}
                    >
                      {listing.quantity ?? "—"} {listing.unit ?? ""} ·{" "}
                      {listing.budget_min != null
                        ? "₹" +
                          listing.budget_min.toLocaleString("en-IN")
                        : "Price on request"}{" "}
                      · {listing.city || listing.state || "Nagaland"}
                    </p>
                  </div>

                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "7px 11px",
                      borderRadius: 999,
                      background:
                        listing.status === "active"
                          ? "#dcfce7"
                          : listing.status === "paused"
                            ? "#fef3c7"
                            : "#e5e7eb",
                      color: "#374151",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {listing.status}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 18,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      router.push("/edit-listing/" + listing.id)
                    }
                    disabled={busyId === listing.id}
                  >
                    Edit
                  </button>

                  {listing.status === "active" && (
                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(listing.id, "paused")
                      }
                      disabled={busyId === listing.id}
                    >
                      Pause
                    </button>
                  )}

                  {listing.status === "paused" && (
                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(listing.id, "active")
                      }
                      disabled={busyId === listing.id}
                    >
                      Resume
                    </button>
                  )}

                  {listing.status !== "closed" && (
                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(listing.id, "closed")
                      }
                      disabled={busyId === listing.id}
                    >
                      Close
                    </button>
                  )}

                  {listing.status === "closed" && (
                    <button
                      type="button"
                      onClick={() =>
                        changeStatus(listing.id, "active")
                      }
                      disabled={busyId === listing.id}
                    >
                      Reopen
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteListing(listing.id)}
                    disabled={busyId === listing.id}
                    style={{
                      color: "#b42318",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
