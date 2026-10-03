"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type RequestItem = {
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

export default function MyRequestsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadRequests() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      return;
    }

    const [{ data: requestData, error: requestError }, { data: categoryData }] =
      await Promise.all([
        supabase
          .from("posts")
          .select(
            "id,type,title,description,quantity,unit,budget_min,city,state,category_id,status,created_at"
          )
          .eq("owner_id", user.id)
          .eq("type", "need")
          .order("created_at", { ascending: false }),

        supabase
          .from("categories")
          .select("id,name")
          .order("name"),
      ]);

    if (requestError) {
      setMessage(requestError.message);
      setLoading(false);
      return;
    }

    const categoryMap: Record<string, string> = {};

    (categoryData as Category[] | null)?.forEach((category) => {
      categoryMap[category.id] = category.name;
    });

    setCategories(categoryMap);
    setRequests((requestData ?? []) as RequestItem[]);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 24,
          background: "#f6f7f2",
        }}
      >
        Loading your requests...
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
          <h1 style={{ marginBottom: 8 }}>My Requests</h1>

          <p
            style={{
              color: "#697067",
              margin: 0,
            }}
          >
            Manage the products and services you are looking for.
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
          + Create New Request
        </button>

        {requests.length === 0 ? (
          <section
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <h2>No requests yet</h2>

            <p style={{ color: "#697067" }}>
              Create a request when you are looking for a product or service.
            </p>

            <button
              type="button"
              onClick={() => router.push("/create-listing")}
              style={{
                marginTop: 10,
                padding: "11px 16px",
                borderRadius: 10,
              }}
            >
              Create a Request
            </button>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {requests.map((request) => (
              <article
                key={request.id}
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
                      I Need ·{" "}
                      {categories[request.category_id ?? ""] ??
                        "Uncategorized"}
                    </p>

                    <h2
                      style={{
                        margin: "0 0 8px",
                      }}
                    >
                      {request.title}
                    </h2>

                    {request.description && (
                      <p
                        style={{
                          color: "#4b5563",
                          lineHeight: 1.5,
                        }}
                      >
                        {request.description}
                      </p>
                    )}

                    <p
                      style={{
                        color: "#697067",
                        marginBottom: 0,
                      }}
                    >
                      {request.quantity ?? "—"}{" "}
                      {request.unit ?? ""} ·{" "}
                      {request.budget_min != null
                        ? "Budget ₹" +
                          request.budget_min.toLocaleString("en-IN")
                        : "Budget not specified"}{" "}
                      · {request.city || request.state || "Nagaland"}
                    </p>
                  </div>

                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "7px 11px",
                      borderRadius: 999,
                      background:
                        request.status === "active"
                          ? "#dcfce7"
                          : request.status === "paused"
                            ? "#fef3c7"
                            : "#e5e7eb",
                      color: "#374151",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {request.status}
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
                      router.push("/edit-listing/" + request.id)
                    }
                  >
                    Edit Request
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/listing/" + request.id)
                    }
                  >
                    View Request
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
