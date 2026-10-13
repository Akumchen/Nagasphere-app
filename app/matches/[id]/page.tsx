
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type MatchRow = {
  have_id: string;
  score: number | string;
  reasons: unknown;
};

type HavePost = {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  state: string | null;
  quantity: string | null;
  budget_min: number | null;
};

type MatchResult = MatchRow & {
  post: HavePost;
};

export default function MatchesPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [needTitle, setNeedTitle] = useState("Your request");

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      setLoading(true);
      setError("");

      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/auth");
          return;
        }

        const { data: need, error: needError } = await supabase
          .from("posts")
          .select("id, owner_id, type, status, title")
          .eq("id", id)
          .maybeSingle();

        if (needError) throw needError;

        if (
          !need ||
          need.owner_id !== user.id ||
          need.type !== "need"
        ) {
          throw new Error(
            "This request could not be found or you do not have permission to view its matches."
          );
        }

        if (need.status !== "active") {
          throw new Error(
            "Please reopen this request before looking for matches."
          );
        }

        if (!cancelled) setNeedTitle(need.title || "Your request");

        const { data: matches, error: matchError } = await supabase.rpc(
          "find_matches",
          {
            p_need_id: id,
            p_limit: 10,
          }
        );

        if (matchError) throw matchError;

        const matchRows = (matches || []) as MatchRow[];

        if (matchRows.length === 0) {
          if (!cancelled) setResults([]);
          return;
        }

        const haveIds = matchRows.map((match) => match.have_id);

        const { data: posts, error: postsError } = await supabase
          .from("posts")
          .select(
            "id, title, description, city, state, quantity, budget_min"
          )
          .in("id", haveIds)
          .eq("type", "have")
          .eq("status", "active");

        if (postsError) throw postsError;

        const postMap = new Map<string, HavePost>(
          ((posts || []) as HavePost[]).map((post) => [
            post.id,
            post,
          ])
        );

        const combined: MatchResult[] = matchRows
          .map((match) => {
            const post = postMap.get(match.have_id);
            return post ? { ...match, post } : null;
          })
          .filter(
            (match): match is MatchResult => match !== null
          );

        if (!cancelled) setResults(combined);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load matches. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const pageStyle = {
    minHeight: "100vh",
    padding: "24px 16px 48px",
    background:
      "linear-gradient(135deg, #f1f5ee 0%, #e5eee4 55%, #f8f5eb 100%)",
    color: "#20392b",
    fontFamily: "Arial, sans-serif",
  } as const;

  const cardStyle = {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(43,87,57,0.15)",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(25,55,35,0.08)",
  } as const;

  const buttonStyle = {
    display: "inline-block",
    border: "1px solid #245b3a",
    borderRadius: "10px",
    padding: "11px 16px",
    background: "#245b3a",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
  } as const;

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => router.push("/my-requests")}
          style={{
            ...buttonStyle,
            background: "transparent",
            color: "#245b3a",
            marginBottom: 20,
          }}
        >
          ← Back to My Requests
        </button>

        <header style={{ marginBottom: 24 }}>
          <p
            style={{
              margin: "0 0 8px",
              color: "#52745c",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            NAGASPHERE MATCHING
          </p>
          <h1 style={{ margin: "0 0 8px", fontSize: 30 }}>
            Find Matches
          </h1>
          <p style={{ margin: 0, color: "#52665a", lineHeight: 1.6 }}>
            Available listings that may help fulfil your request:
            {" "}
            <strong>{needTitle}</strong>
          </p>
        </header>

        {loading ? (
          <section style={cardStyle}>
            Loading matching listings…
          </section>
        ) : error ? (
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Unable to show matches</h2>
            <p style={{ lineHeight: 1.6 }}>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={buttonStyle}
            >
              Try again
            </button>
          </section>
        ) : results.length === 0 ? (
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>No matches yet</h2>
            <p style={{ lineHeight: 1.7 }}>
              We couldn’t find active listings matching this request
              right now. New sellers may list suitable products or
              services later, so check again soon.
            </p>
            <button
              type="button"
              onClick={() => router.push("/listing")}
              style={buttonStyle}
            >
              Browse all listings
            </button>
          </section>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            <p style={{ margin: "0 0 2px", color: "#52665a" }}>
              Found {results.length} possible{" "}
              {results.length === 1 ? "match" : "matches"}.
              Contact the seller to confirm availability and details.
            </p>

            {results.map((match) => {
              const score = Math.round(Number(match.score) * 100);

              return (
                <article key={match.post.id} style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: 21 }}>
                      {match.post.title}
                    </h2>
                    <span
                      style={{
                        background: "#e5f3e7",
                        color: "#21633b",
                        borderRadius: 999,
                        padding: "7px 11px",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {Number.isFinite(score) ? `${score}% match` : "Possible match"}
                    </span>
                  </div>

                  {match.post.description && (
                    <p style={{ lineHeight: 1.65, color: "#52665a" }}>
                      {match.post.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      margin: "16px 0",
                      fontSize: 14,
                    }}
                  >
                    {(match.post.city || match.post.state) && (
                      <div>
                        <strong>Location:</strong>{" "}
                        {[match.post.city, match.post.state]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                    {match.post.quantity && (
                      <div>
                        <strong>Quantity:</strong> {match.post.quantity}
                      </div>
                    )}
                    {match.post.budget_min != null && (
                      <div>
                        <strong>Listed price/budget from:</strong>{" "}
                        ₹{match.post.budget_min.toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/listing/" + match.post.id)
                    }
                    style={buttonStyle}
                  >
                    View listing & contact seller
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

