
"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const colors = {
  forest: "#173c2a",
  deepForest: "#102d20",
  green: "#176747",
  gold: "#d8d5a0",
  ivory: "#fffdf5",
  text: "#243229",
  muted: "#6b746c",
  line: "rgba(35, 65, 43, 0.14)",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "14px 15px",
  marginTop: "8px",
  border: `1px solid ${colors.line}`,
  borderRadius: "13px",
  background: "rgba(255,255,255,0.78)",
  color: colors.text,
  fontSize: "15px",
  lineHeight: 1.5,
  outlineColor: colors.green,
  boxShadow:
    "0 4px 14px rgba(7,29,19,0.035), inset 0 1px 0 rgba(255,255,255,0.8)",
};

const labelStyle = {
  display: "block",
  marginBottom: "20px",
  color: colors.text,
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.01em",
};

const bubbleStyle = {
  minWidth: 0,
  padding: "clamp(20px,3vw,30px)",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.9)",
  background:
    "linear-gradient(145deg,rgba(255,253,247,0.97),rgba(239,246,237,0.94))",
  boxShadow:
    "0 18px 42px rgba(7,29,19,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setMessage(error.message);
      } else if (data) {
        setFullName(data.full_name ?? "");
        setPhone(data.phone ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
        })
        .eq("id", user.id);

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Profile saved successfully.");
      }
    } catch {
      setMessage("We couldn't save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        className="nagasphere-inner-page"
        style={{
          minHeight: "100vh",
          boxSizing: "border-box",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          color: colors.forest,
          fontSize: "15px",
        }}
      >
        <div
          style={{
            padding: "24px 30px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.85)",
            background: "rgba(255,253,247,0.92)",
            boxShadow: "0 18px 50px rgba(10,37,24,0.14)",
          }}
        >
          Preparing your profile...
        </div>
      </main>
    );
  }

  const statusIsSuccess = message.includes("successfully");

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "clamp(16px,3.5vw,36px) 14px 64px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1120px",
          margin: "0 auto",
        }}
      >
        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
            padding: "10px 14px",
            border: "1px solid rgba(255,255,255,0.84)",
            borderRadius: "18px",
            background: "rgba(255,253,247,0.86)",
            boxShadow: "0 8px 24px rgba(10,37,24,0.09)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <Link
            href="/"
            aria-label="NagaSphere home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              minWidth: 0,
              textDecoration: "none",
            }}
          >
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                display: "block",
                width: "clamp(112px,19vw,150px)",
                height: "auto",
                maxHeight: "48px",
                objectFit: "contain",
              }}
            />
          </Link>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 14px",
              borderRadius: "12px",
              border: `1px solid ${colors.line}`,
              color: colors.forest,
              background: "rgba(255,255,255,0.76)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Dashboard ↗
          </Link>
        </nav>

        {/* Premium account hero */}
        <section
          style={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(100%,260px),1fr))",
            alignItems: "center",
            gap: "24px",
            padding: "clamp(24px,4vw,42px)",
            marginBottom: "28px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.35)",
            background:
              "linear-gradient(120deg,rgba(14,48,32,0.98),rgba(24,77,52,0.96) 58%,rgba(49,91,62,0.94))",
            boxShadow:
              "0 25px 60px rgba(7,29,19,0.24),inset 0 1px 0 rgba(255,255,255,0.15)",
            color: colors.ivory,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              zIndex: -1,
              width: "320px",
              height: "320px",
              right: "-100px",
              top: "-190px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(220,205,145,0.28),transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 11px",
                marginBottom: "16px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.09)",
                color: "#e8e6c9",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: colors.gold,
                }}
              />
              Your NagaSphere account
            </div>

            <h1
              style={{
                margin: 0,
                color: colors.ivory,
                fontSize: "clamp(30px,5vw,44px)",
                lineHeight: 1.1,
                letterSpacing: "-0.035em",
                fontWeight: 750,
              }}
            >
              My Profile
            </h1>

            <p
              style={{
                maxWidth: "560px",
                margin: "14px 0 0",
                color: "rgba(255,253,245,0.78)",
                fontSize: "15px",
                lineHeight: 1.75,
              }}
            >
              Your account, your marketplace. Keep your personal details
              current so your NagaSphere experience stays connected.
            </p>
          </div>

          <div
            style={{
              justifySelf: "start",
              width: "100%",
              maxWidth: "300px",
              boxSizing: "border-box",
              padding: "19px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                color: "#e8e6c9",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Signed-in account
            </div>
            <div
              style={{
                color: colors.ivory,
                fontSize: "15px",
                lineHeight: 1.6,
                fontWeight: 650,
                overflowWrap: "anywhere",
              }}
            >
              {email || "Your email account"}
            </div>
            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(255,253,245,0.72)",
                fontSize: "12px",
                lineHeight: 1.6,
              }}
            >
              Your email is displayed here and cannot be edited on this page.
            </div>
          </div>
        </section>

        {/* Account details form */}
        <form onSubmit={handleSave}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(min(100%,320px),1fr))",
              alignItems: "stretch",
              gap: "22px",
            }}
          >
            {/* Personal details bubble */}
            <section style={bubbleStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  marginBottom: "25px",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    width: "46px",
                    height: "46px",
                    borderRadius: "15px",
                    background: "rgba(23,103,71,0.1)",
                    color: colors.green,
                    fontSize: "22px",
                  }}
                >
                  ◈
                </div>
                <div>
                  <h2
                    style={{
                      margin: "1px 0 6px",
                      color: colors.forest,
                      fontSize: "20px",
                      lineHeight: 1.3,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Personal details
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      color: colors.muted,
                      fontSize: "13px",
                      lineHeight: 1.65,
                    }}
                  >
                    The name associated with your marketplace account.
                  </p>
                </div>
              </div>

              <label style={labelStyle}>
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  style={inputStyle}
                />
              </label>

              <label style={{ ...labelStyle, marginBottom: 0 }}>
                Account email
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  disabled
                  readOnly
                  style={{
                    ...inputStyle,
                    background: "rgba(232,237,230,0.82)",
                    color: colors.muted,
                    cursor: "not-allowed",
                    boxShadow: "inset 0 1px 2px rgba(7,29,19,0.04)",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    marginTop: "8px",
                    color: colors.muted,
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  Email changes are not available from this form.
                </span>
              </label>
            </section>

            {/* Contact details bubble */}
            <section style={bubbleStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  marginBottom: "25px",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    width: "46px",
                    height: "46px",
                    borderRadius: "15px",
                    background: "rgba(23,103,71,0.1)",
                    color: colors.green,
                    fontSize: "22px",
                  }}
                >
                  ◌
                </div>
                <div>
                  <h2
                    style={{
                      margin: "1px 0 6px",
                      color: colors.forest,
                      fontSize: "20px",
                      lineHeight: 1.3,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Contact details
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      color: colors.muted,
                      fontSize: "13px",
                      lineHeight: 1.65,
                    }}
                  >
                    Keep your contact number up to date.
                  </p>
                </div>
              </div>

              <label style={{ ...labelStyle, marginBottom: "24px" }}>
                Phone number
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your phone number"
                  style={inputStyle}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "15px",
                  borderRadius: "15px",
                  border: "1px solid rgba(23,103,71,0.12)",
                  background:
                    "linear-gradient(135deg,rgba(23,103,71,0.07),rgba(216,213,160,0.15))",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    color: colors.green,
                    fontSize: "18px",
                    lineHeight: 1.3,
                  }}
                >
                  ✦
                </span>
                <p
                  style={{
                    margin: 0,
                    color: colors.muted,
                    fontSize: "12px",
                    lineHeight: 1.7,
                  }}
                >
                  Use a number you can access if a marketplace contact needs
                  to reach you.
                </p>
              </div>
            </section>
          </div>

          {/* Save and navigation actions */}
          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginTop: "24px",
              padding: "20px",
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.82)",
              background: "rgba(255,253,247,0.84)",
              boxShadow: "0 12px 30px rgba(7,29,19,0.09)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div style={{ minWidth: 0, flex: "1 1 220px" }}>
              <div
                style={{
                  color: colors.forest,
                  fontSize: "14px",
                  fontWeight: 750,
                }}
              >
                Keep your account up to date
              </div>
              <p
                style={{
                  margin: "5px 0 0",
                  color: colors.muted,
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                Save your changes before leaving this page.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                flex: "1 1 190px",
                maxWidth: "280px",
                padding: "15px 20px",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "14px",
                background: saving
                  ? "#61796a"
                  : "linear-gradient(125deg,#173c2a 0%,#176747 100%)",
                color: "#fffdf5",
                fontWeight: 750,
                fontSize: "14px",
                cursor: saving ? "wait" : "pointer",
                boxShadow:
                  "0 10px 24px rgba(7,29,19,0.18),inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {saving ? "Saving profile..." : "Save profile"}
            </button>
          </section>
        </form>

        {/* Business profile link */}
        <Link
          href="/business-profile"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "18px",
            padding: "19px 22px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.82)",
            background: "rgba(255,253,247,0.82)",
            boxShadow: "0 10px 26px rgba(7,29,19,0.08)",
            color: colors.forest,
            textDecoration: "none",
          }}
        >
          <span>
            <span
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 750,
              }}
            >
              Manage your Business Profile
            </span>
            <span
              style={{
                display: "block",
                marginTop: "5px",
                color: colors.muted,
                fontSize: "12px",
                lineHeight: 1.6,
              }}
            >
              Update your business details separately from your personal
              account.
            </span>
          </span>
          <span
            aria-hidden="true"
            style={{
              color: colors.green,
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            →
          </span>
        </Link>

        {/* Save status */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: "18px",
              padding: "14px 16px",
              borderRadius: "15px",
              background: statusIsSuccess
                ? "rgba(20,107,74,0.09)"
                : "rgba(150,55,40,0.09)",
              border: statusIsSuccess
                ? "1px solid rgba(20,107,74,0.18)"
                : "1px solid rgba(150,55,40,0.18)",
              color: statusIsSuccess ? "#146b4a" : "#8a392d",
              fontSize: "13px",
              lineHeight: 1.6,
              overflowWrap: "anywhere",
            }}
          >
            {message}
          </div>
        )}

        <footer
          style={{
            padding: "25px 10px 0",
            textAlign: "center",
            color: "rgba(255,253,245,0.9)",
            fontSize: "12px",
            lineHeight: 1.7,
            textShadow: "0 1px 8px rgba(7,29,19,0.35)",
          }}
        >
          NagaSphere · Nagaland's local marketplace
        </footer>
      </div>
    </main>
  );
}
