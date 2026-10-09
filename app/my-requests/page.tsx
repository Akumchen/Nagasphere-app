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

const palette = {
  forest: "#173d2b",
  forestDark: "#102d20",
  green: "#477653",
  cream: "#fbf8ef",
  ivory: "#fffdf8",
  text: "#24372b",
  muted: "#69776c",
  border: "rgba(39, 75, 49, 0.15)",
};

const buttonBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  minHeight: 42,
  padding: "10px 15px",
  borderRadius: 12,
  border: `1px solid ${palette.border}`,
  background: "rgba(255,255,255,0.76)",
  color: palette.text,
  fontSize: 13,
  fontWeight: 650,
  cursor: "pointer",
  transition: "background 160ms ease, transform 160ms ease",
};

export default function MyRequestsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadRequests() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.replace("/auth");
      return;
    }

    const [
      { data: requestData, error: requestError },
      { data: categoryData, error: categoryError },
    ] = await Promise.all([
      supabase
        .from("posts")
        .select(
          "id,type,title,description,quantity,unit,budget_min,city,state,category_id,status,created_at"
        )
        .eq("owner_id", user.id)
        .eq("type", "need")
        .order("created_at", { ascending: false }),

      supabase.from("categories").select("id,name").order("name"),
    ]);

    if (requestError) {
      setMessage(requestError.message);
      setLoading(false);
      return;
    }

    if (categoryError) {
      setMessage(
        "Your requests loaded, but category names could not be loaded."
      );
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
    // The page loads the signed-in user's requests on entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        "The request status was not changed. Please check your permissions and try again."
      );
    } else {
      setRequests((current) =>
        current.map((request) =>
          request.id === id
            ? {
                ...request,
                status: data.status as RequestItem["status"],
              }
            : request
        )
      );
      setMessage("Request status updated.");
    }

    setBusyId(null);
  }

  async function deleteRequest(id: string) {
    if (!window.confirm("Delete this request permanently?")) {
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
      setRequests((current) =>
        current.filter((request) => request.id !== id)
      );
      setMessage("Request deleted.");
    }

    setBusyId(null);
  }

  const activeCount = requests.filter(
    (request) => request.status === "active"
  ).length;

  const pausedCount = requests.filter(
    (request) => request.status === "paused"
  ).length;

  const closedCount = requests.filter(
    (request) =>
      request.status === "closed" || request.status === "removed"
  ).length;

  function statusStyle(status: RequestItem["status"]): React.CSSProperties {
    if (status === "active") {
      return {
        color: "#21633b",
        background: "#e5f3e7",
        border: "1px solid #c8e3ce",
      };
    }

    if (status === "paused") {
      return {
        color: "#815b19",
        background: "#fff2d5",
        border: "1px solid #f0dfb5",
      };
    }

    return {
      color: "#656d66",
      background: "#ecefea",
      border: "1px solid #dce1da",
    };
  }

  const panelStyle: React.CSSProperties = {
    background:
      "linear-gradient(145deg, rgba(255,253,248,0.97), rgba(246,247,237,0.94))",
    border: "1px solid rgba(255,255,255,0.78)",
    borderRadius: 22,
    boxShadow: "0 16px 42px rgba(13, 39, 24, 0.12)",
    backdropFilter: "blur(12px)",
  };

  if (loading) {
    return (
      <main
        className="nagasphere-inner-page"
        style={{
          minHeight: "100vh",
          padding: "28px 16px",
          display: "grid",
          placeItems: "center",
          color: palette.text,
        }}
      >
        <section
          style={{
            ...panelStyle,
            width: "min(100%, 440px)",
            padding: "34px 26px",
            textAlign: "center",
          }}
        >
          <img
            src="/nagasphere-logo.png"
            alt="NagaSphere"
            style={{
              width: "min(190px, 70%)",
              height: "auto",
              margin: "0 auto 24px",
              display: "block",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              width: 30,
              height: 30,
              margin: "0 auto 16px",
              borderRadius: "50%",
              border: "3px solid #dce5da",
              borderTopColor: palette.forest,
              animation: "nagaSpin 0.8s linear infinite",
            }}
          />
          <p style={{ margin: 0, fontWeight: 650 }}>
            Loading your requests…
          </p>
          <style>{`
            @keyframes nagaSpin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </section>
      </main>
    );
  }

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        padding: "clamp(14px, 3vw, 32px)",
        color: palette.text,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        {/* Brand header */}
        <header
          style={{
            ...panelStyle,
            padding: "13px 18px",
            marginBottom: 25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Go to NagaSphere home"
            style={{
              padding: 0,
              border: 0,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                display: "block",
                width: "clamp(125px, 24vw, 178px)",
                maxHeight: 68,
                objectFit: "contain",
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={{
              ...buttonBase,
              background: palette.forest,
              color: "#fffdf7",
              borderColor: palette.forest,
              padding: "11px 17px",
            }}
          >
            <span aria-hidden="true">←</span>
            Dashboard
          </button>
        </header>

        {/* Page introduction */}
        <section
          style={{
            ...panelStyle,
            position: "relative",
            overflow: "hidden",
            padding: "clamp(23px, 5vw, 42px)",
            marginBottom: 20,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              right: -75,
              top: -95,
              background:
                "radial-gradient(circle, rgba(129,164,115,0.23), rgba(129,164,115,0))",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                margin: "0 0 10px",
                color: palette.green,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.19em",
                textTransform: "uppercase",
              }}
            >
              Your marketplace activity
            </p>

            <h1
              style={{
                margin: "0 0 12px",
                color: palette.forestDark,
                fontSize: "clamp(30px, 5vw, 45px)",
                lineHeight: 1.12,
                letterSpacing: "-0.045em",
                fontWeight: 800,
              }}
            >
              My Requests
            </h1>

            <p
              style={{
                maxWidth: 570,
                margin: 0,
                color: palette.muted,
                fontSize: 15,
                lineHeight: 1.8,
              }}
            >
              Looking for something in Nagaland? Keep track of the products
              and services you need, and manage each request in one place.
            </p>

            <button
              type="button"
              onClick={() => router.push("/create-listing")}
              style={{
                ...buttonBase,
                marginTop: 23,
                minHeight: 47,
                padding: "13px 20px",
                borderRadius: 13,
                borderColor: palette.forest,
                background: palette.forest,
                color: "#fffdf7",
                fontSize: 14,
                boxShadow: "0 7px 18px rgba(23,61,43,0.17)",
              }}
            >
              <span style={{ fontSize: 19, lineHeight: 1 }}>+</span>
              Create New Request
            </button>
          </div>
        </section>

        {/* Summary cards */}
        <section
          aria-label="Request summary"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
            gap: 13,
            marginBottom: 25,
          }}
        >
          {[
            {
              label: "Total requests",
              count: requests.length,
              mark: "◎",
            },
            {
              label: "Active",
              count: activeCount,
              mark: "↗",
            },
            {
              label: "Paused",
              count: pausedCount,
              mark: "Ⅱ",
            },
            {
              label: "Closed",
              count: closedCount,
              mark: "✓",
            },
          ].map((item) => (
            <article
              key={item.label}
              style={{
                ...panelStyle,
                padding: "19px 20px",
                borderRadius: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    color: palette.muted,
                    fontSize: 12,
                    fontWeight: 650,
                  }}
                >
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    color: palette.green,
                    fontSize: 19,
                    fontWeight: 700,
                  }}
                >
                  {item.mark}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  color: palette.forestDark,
                  fontSize: 31,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {item.count}
              </p>
            </article>
          ))}
        </section>

        {/* Feedback and errors */}
        {message && (
          <div
            role="status"
            style={{
              marginBottom: 20,
              padding: "13px 16px",
              borderRadius: 13,
              border: `1px solid ${palette.border}`,
              background: "rgba(255,253,248,0.94)",
              color: palette.text,
              fontSize: 13,
              lineHeight: 1.6,
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </div>
        )}

        {/* Requests list */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 15,
              padding: "0 2px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 5px",
                  color: "#fffdf7",
                  fontSize: "clamp(21px, 4vw, 26px)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.22)",
                }}
              >
                Your listings
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "#f3f4ed",
                  fontSize: 13,
                  textShadow: "0 1px 8px rgba(0,0,0,0.2)",
                }}
              >
                {requests.length === 1
                  ? "1 request in your account"
                  : `${requests.length} requests in your account`}
              </p>
            </div>

            <button
              type="button"
              onClick={loadRequests}
              style={{
                ...buttonBase,
                background: "rgba(255,253,248,0.94)",
              }}
            >
              ↻ Refresh
            </button>
          </div>

          {requests.length === 0 ? (
            <section
              style={{
                ...panelStyle,
                padding: "clamp(28px, 6vw, 52px) 22px",
                textAlign: "center",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 66,
                  height: 66,
                  margin: "0 auto 19px",
                  borderRadius: 22,
                  display: "grid",
                  placeItems: "center",
                  background: "#e9f0e5",
                  color: palette.forest,
                  fontSize: 29,
                }}
              >
                ♧
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  color: palette.forestDark,
                  fontSize: 23,
                  fontWeight: 800,
                }}
              >
                No requests yet
              </h2>

              <p
                style={{
                  maxWidth: 410,
                  margin: "0 auto",
                  color: palette.muted,
                  fontSize: 14,
                  lineHeight: 1.8,
                }}
              >
                When you need a product or service, create a request here
                and manage it from your account.
              </p>

              <button
                type="button"
                onClick={() => router.push("/create-listing")}
                style={{
                  ...buttonBase,
                  marginTop: 22,
                  background: palette.forest,
                  color: "#fffdf7",
                  borderColor: palette.forest,
                }}
              >
                Create your first request
              </button>
            </section>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              {requests.map((request) => {
                const isBusy = busyId === request.id;
                const categoryName =
                  categories[request.category_id ?? ""] ??
                  "Uncategorized";

                return (
                  <article
                    key={request.id}
                    style={{
                      ...panelStyle,
                      padding: "clamp(19px, 4vw, 27px)",
                      borderRadius: 20,
                      opacity: isBusy ? 0.72 : 1,
                      transition: "opacity 160ms ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 15,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 8,
                            marginBottom: 12,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              borderRadius: 999,
                              padding: "6px 10px",
                              background: "#e7f0e4",
                              color: "#2e623b",
                              fontSize: 11,
                              fontWeight: 800,
                              letterSpacing: "0.04em",
                            }}
                          >
                            I NEED
                          </span>

                          <span
                            style={{
                              color: palette.muted,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {categoryName}
                          </span>
                        </div>

                        <h3
                          style={{
                            margin: "0 0 10px",
                            color: palette.forestDark,
                            fontSize: "clamp(19px, 3vw, 24px)",
                            lineHeight: 1.35,
                            fontWeight: 800,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {request.title}
                        </h3>

                        {request.description && (
                          <p
                            style={{
                              margin: "0 0 16px",
                              color: "#536258",
                              fontSize: 14,
                              lineHeight: 1.8,
                              whiteSpace: "pre-wrap",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {request.description}
                          </p>
                        )}
                      </div>

                      <span
                        style={{
                          ...statusStyle(request.status),
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          borderRadius: 999,
                          padding: "7px 11px",
                          fontSize: 11,
                          fontWeight: 800,
                          textTransform: "capitalize",
                        }}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        marginTop: 4,
                        marginBottom: 19,
                      }}
                    >
                      <div
                        style={{
                          flex: "1 1 130px",
                          padding: "12px 13px",
                          border: `1px solid ${palette.border}`,
                          background: "rgba(255,255,255,0.55)",
                          borderRadius: 13,
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 5px",
                            color: palette.muted,
                            fontSize: 11,
                            fontWeight: 650,
                          }}
                        >
                          Quantity
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: palette.text,
                            fontSize: 13,
                            fontWeight: 750,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {request.quantity ?? "Not specified"}{" "}
                          {request.unit ?? ""}
                        </p>
                      </div>

                      <div
                        style={{
                          flex: "1 1 150px",
                          padding: "12px 13px",
                          border: `1px solid ${palette.border}`,
                          background: "rgba(255,255,255,0.55)",
                          borderRadius: 13,
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 5px",
                            color: palette.muted,
                            fontSize: 11,
                            fontWeight: 650,
                          }}
                        >
                          Minimum budget
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: palette.text,
                            fontSize: 13,
                            fontWeight: 750,
                          }}
                        >
                          {request.budget_min != null
                            ? `₹${request.budget_min.toLocaleString("en-IN")}`
                            : "Not specified"}
                        </p>
                      </div>

                      <div
                        style={{
                          flex: "1 1 130px",
                          padding: "12px 13px",
                          border: `1px solid ${palette.border}`,
                          background: "rgba(255,255,255,0.55)",
                          borderRadius: 13,
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 5px",
                            color: palette.muted,
                            fontSize: 11,
                            fontWeight: 650,
                          }}
                        >
                          Location
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: palette.text,
                            fontSize: 13,
                            fontWeight: 750,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {[request.city, request.state]
                            .filter(Boolean)
                            .join(", ") || "Nagaland"}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop: `1px solid ${palette.border}`,
                        paddingTop: 17,
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 9,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          router.push("/edit-listing/" + request.id)
                        }
                        disabled={isBusy}
                        style={{
                          ...buttonBase,
                          background: palette.forest,
                          color: "#fffdf7",
                          borderColor: palette.forest,
                        }}
                      >
                        Edit request
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          router.push("/listing/" + request.id)
                        }
                        disabled={isBusy}
                        style={buttonBase}
                      >
                        View request
                      </button>

                      {request.status === "active" && (
                        <button
                          type="button"
                          onClick={() =>
                            changeStatus(request.id, "paused")
                          }
                          disabled={isBusy}
                          style={buttonBase}
                        >
                          Pause
                        </button>
                      )}

                      {request.status === "paused" && (
                        <button
                          type="button"
                          onClick={() =>
                            changeStatus(request.id, "active")
                          }
                          disabled={isBusy}
                          style={buttonBase}
                        >
                          Resume
                        </button>
                      )}

                      {request.status !== "closed" &&
                        request.status !== "removed" && (
                          <button
                            type="button"
                            onClick={() =>
                              changeStatus(request.id, "closed")
                            }
                            disabled={isBusy}
                            style={buttonBase}
                          >
                            Close
                          </button>
                        )}

                      {request.status === "closed" && (
                        <button
                          type="button"
                          onClick={() =>
                            changeStatus(request.id, "active")
                          }
                          disabled={isBusy}
                          style={buttonBase}
                        >
                          Reopen
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteRequest(request.id)}
                        disabled={isBusy}
                        style={{
                          ...buttonBase,
                          color: "#a33131",
                          borderColor: "rgba(163,49,49,0.22)",
                          background: "rgba(255,245,242,0.86)",
                        }}
                      >
                        Delete
                      </button>

                      {isBusy && (
                        <span
                          role="status"
                          style={{
                            color: palette.muted,
                            fontSize: 12,
                          }}
                        >
                          Saving…
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        margin: "14px 0 0",
                        color: "#7a857b",
                        fontSize: 11,
                      }}
                    >
                      Created{" "}
                      {new Date(request.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: "28px 10px 12px",
            textAlign: "center",
            color: "#fffdf7",
            fontSize: 12,
            lineHeight: 1.8,
            textShadow: "0 1px 8px rgba(0,0,0,0.25)",
          }}
        >
          <p style={{ margin: "0 0 4px", fontWeight: 700 }}>
            NagaSphere
          </p>
          <p style={{ margin: 0 }}>
            Nagaland&apos;s local marketplace
          </p>
        </footer>
      </div>
    </main>
  );
}
