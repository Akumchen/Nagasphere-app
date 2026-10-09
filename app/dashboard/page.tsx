
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const colors = {
  green: "#173b2b",
  deepGreen: "#10291e",
  forest: "#0c241a",
  ivory: "#faf8ef",
  muted: "#66746a",
  gold: "#c7a96b",
  border: "rgba(255,255,255,0.72)",
};

const buttonStyle: React.CSSProperties = {
  border: "1px solid rgba(31,65,47,0.18)",
  background: "rgba(255,255,255,0.78)",
  color: colors.green,
  padding: "10px 15px",
  borderRadius: "11px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 700,
  minHeight: "42px",
};

const cards = [
  {
    title: "My Listings",
    eyebrow: "YOUR MARKETPLACE",
    description:
      "Manage the products and services you offer to people across Nagaland.",
    path: "/my-listings",
    icon: "◇",
    number: "01",
  },
  {
    title: "My Requests",
    eyebrow: "WHAT YOU NEED",
    description:
      "Keep track of the products and services you are looking for.",
    path: "/my-requests",
    icon: "⌁",
    number: "02",
  },
  {
    title: "Messages",
    eyebrow: "YOUR CONVERSATIONS",
    description:
      "Connect with buyers and sellers and continue your conversations.",
    path: "/messages",
    icon: "✉",
    number: "03",
  },
  {
    title: "My Profile",
    eyebrow: "YOUR ACCOUNT",
    description:
      "Manage your profile and the information people see about you.",
    path: "/profile",
    icon: "○",
    number: "04",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !user) {
        router.replace("/auth");
        return;
      }

      setEmail(user.email ?? "");
      setLoading(false);
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  async function handleLogout() {
    if (signingOut) return;

    setSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setSigningOut(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "clamp(14px, 3.5vw, 34px) clamp(12px, 3vw, 24px) 38px",
  };

  const shellStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "1080px",
    margin: "0 auto",
  };

  const glassStyle: React.CSSProperties = {
    border: `1px solid ${colors.border}`,
    background:
      "linear-gradient(135deg, rgba(250,249,241,0.95), rgba(235,240,225,0.88))",
    boxShadow: "0 16px 42px rgba(3,20,12,0.22)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  };

  if (loading) {
    return (
      <main
        className="nagasphere-inner-page"
        style={{
          ...pageStyle,
          display: "grid",
          placeItems: "center",
          color: "#fffdf4",
          fontSize: "15px",
          fontWeight: 650,
        }}
      >
        Preparing your dashboard...
      </main>
    );
  }

  return (
    <main className="nagasphere-inner-page" style={pageStyle}>
      <div style={shellStyle}>
        {/* Compact navigation header */}
        <header
          style={{
            ...glassStyle,
            borderRadius: "17px",
            padding: "10px 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
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
                maxHeight: "56px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            style={{
              ...buttonStyle,
              background: colors.deepGreen,
              borderColor: colors.deepGreen,
              color: colors.ivory,
              opacity: signingOut ? 0.7 : 1,
              cursor: signingOut ? "wait" : "pointer",
            }}
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </header>

        {/* Dramatic forest-green welcome panel */}
        <section
          style={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            marginTop: "20px",
            padding: "clamp(25px, 5.5vw, 46px)",
            borderRadius: "24px",
            border: "1px solid rgba(225,208,159,0.42)",
            background:
              "radial-gradient(ellipse at 95% 0%, rgba(128,157,102,0.34), transparent 43%), linear-gradient(125deg, #102b1e 0%, #173d2a 56%, #0a2118 100%)",
            boxShadow: "0 22px 52px rgba(3,18,11,0.34)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-100px",
              right: "-65px",
              width: "270px",
              height: "270px",
              borderRadius: "50%",
              border: "1px solid rgba(218,195,134,0.20)",
              boxShadow:
                "0 0 0 24px rgba(218,195,134,0.035), 0 0 0 49px rgba(218,195,134,0.025)",
              pointerEvents: "none",
              zIndex: -1,
            }}
          />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              color: "#e3c989",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "22px",
                height: "1px",
                background: colors.gold,
              }}
            />
            Your local marketplace
          </div>

          <h1
            style={{
              margin: "19px 0 12px",
              maxWidth: "720px",
              color: "#fffdf4",
              fontSize: "clamp(31px, 6.5vw, 49px)",
              lineHeight: 1.09,
              letterSpacing: "-1.5px",
              fontWeight: 750,
              textWrap: "balance",
            }}
          >
            Welcome to
            <br />
            <span style={{ color: "#dfc487" }}>NagaSphere.</span>
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "560px",
              color: "rgba(250,249,241,0.82)",
              fontSize: "14px",
              lineHeight: 1.85,
            }}
          >
            Your space to connect, discover, and do business with
            people across Nagaland.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "26px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                maxWidth: "100%",
                minWidth: 0,
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.07)",
                color: "#fffdf4",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "29px",
                  height: "29px",
                  flex: "0 0 29px",
                  borderRadius: "50%",
                  background: "rgba(222,196,135,0.16)",
                  color: "#e3c989",
                  fontSize: "14px",
                }}
              >
                ○
              </span>

              <span
                style={{
                  minWidth: 0,
                  overflowWrap: "anywhere",
                  fontSize: "12px",
                  lineHeight: 1.5,
                  color: "rgba(255,253,244,0.9)",
                }}
              >
                {email}
              </span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#e3c989",
                fontSize: "11px",
                fontWeight: 750,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              <span aria-hidden="true">✦</span>
              Made for Nagaland
            </div>
          </div>

          <div
            aria-hidden="true"
            style={{
              height: "1px",
              marginTop: "29px",
              background:
                "linear-gradient(90deg, rgba(222,196,135,0.52), rgba(255,255,255,0.13), transparent)",
            }}
          />
        </section>

        {/* Marketplace navigation */}
        <section style={{ marginTop: "25px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              padding: "0 3px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 7px",
                  color: "#f0dba7",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  textShadow: "0 1px 8px rgba(0,0,0,0.28)",
                }}
              >
                Your personal space
              </p>

              <h2
                style={{
                  margin: 0,
                  color: "#fffdf4",
                  fontSize: "clamp(23px, 4.8vw, 31px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.7px",
                  fontWeight: 750,
                  textShadow: "0 2px 12px rgba(0,0,0,0.20)",
                }}
              >
                Everything in one place
              </h2>
            </div>

            <span
              style={{
                color: "rgba(255,253,244,0.83)",
                fontSize: "12px",
                paddingBottom: "3px",
                textShadow: "0 1px 8px rgba(0,0,0,0.28)",
              }}
            >
              Choose a section to continue
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 235px), 1fr))",
              gap: "15px",
              marginTop: "17px",
            }}
          >
            {cards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => router.push(card.path)}
                aria-label={`Open ${card.title}`}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  textAlign: "left",
                  minWidth: 0,
                  minHeight: "218px",
                  padding: "21px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.78)",
                  borderRadius: "19px",
                  background:
                    "linear-gradient(145deg, rgba(252,250,241,0.97), rgba(233,239,222,0.91))",
                  boxShadow: "0 13px 34px rgba(3,20,12,0.20)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  cursor: "pointer",
                  transition:
                    "transform 180ms ease, box-shadow 180ms ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-3px)";
                  event.currentTarget.style.boxShadow =
                    "0 19px 38px rgba(3,20,12,0.28)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                  event.currentTarget.style.boxShadow =
                    "0 13px 34px rgba(3,20,12,0.20)";
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "-39px",
                    top: "-47px",
                    width: "142px",
                    height: "142px",
                    borderRadius: "50%",
                    border: "1px solid rgba(157,179,135,0.23)",
                    boxShadow:
                      "0 0 0 17px rgba(157,179,135,0.06), 0 0 0 35px rgba(157,179,135,0.04)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "49px",
                      height: "49px",
                      flex: "0 0 49px",
                      borderRadius: "15px",
                      border: "1px solid rgba(31,65,47,0.16)",
                      background:
                        "linear-gradient(145deg, #fffef8, #e7eddf)",
                      color: colors.green,
                      fontSize: "26px",
                      boxShadow: "0 5px 13px rgba(17,48,30,0.07)",
                    }}
                  >
                    {card.icon}
                  </div>

                  <span
                    style={{
                      color: "#a18a58",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1.2px",
                    }}
                  >
                    {card.number}
                  </span>
                </div>

                <div style={{ position: "relative", marginTop: "19px" }}>
                  <p
                    style={{
                      margin: "0 0 7px",
                      color: "#7b806e",
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing: "1.5px",
                    }}
                  >
                    {card.eyebrow}
                  </p>

                  <h3
                    style={{
                      margin: 0,
                      color: colors.deepGreen,
                      fontSize: "22px",
                      lineHeight: 1.25,
                      letterSpacing: "-0.5px",
                      fontWeight: 750,
                    }}
                  >
                    {card.title}
                  </h3>

                  <p
                    style={{
                      margin: "9px 0 18px",
                      color: colors.muted,
                      fontSize: "12px",
                      lineHeight: 1.8,
                    }}
                  >
                    {card.description}
                  </p>
                </div>

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginTop: "auto",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(31,65,47,0.12)",
                    color: colors.green,
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  <span>Explore section</span>
                  <span aria-hidden="true" style={{ fontSize: "17px" }}>
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Closing brand panel */}
        <section
          style={{
            marginTop: "20px",
            padding: "clamp(20px, 4vw, 27px)",
            display: "flex",
            alignItems: "flex-start",
            gap: "15px",
            border: "1px solid rgba(224,204,157,0.35)",
            borderRadius: "19px",
            background:
              "linear-gradient(120deg, rgba(12,36,26,0.96), rgba(24,61,42,0.93))",
            boxShadow: "0 14px 32px rgba(3,20,12,0.24)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              flex: "0 0 43px",
              width: "43px",
              height: "43px",
              display: "grid",
              placeItems: "center",
              borderRadius: "14px",
              border: "1px solid rgba(222,196,135,0.35)",
              background: "rgba(222,196,135,0.10)",
              color: "#e3c989",
              fontSize: "21px",
            }}
          >
            ✦
          </div>

          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: "1px 0 7px",
                color: "#fffdf4",
                fontSize: "17px",
                fontWeight: 750,
                letterSpacing: "-0.2px",
              }}
            >
              Local needs. Global reach.
            </h2>

            <p
              style={{
                margin: 0,
                color: "rgba(250,249,241,0.76)",
                fontSize: "13px",
                lineHeight: 1.8,
              }}
            >
              Discover local products and services, build connections,
              and make more opportunities possible throughout Nagaland.
            </p>
          </div>
        </section>

        <footer
          style={{
            padding: "20px 8px 0",
            textAlign: "center",
            color: "rgba(255,253,244,0.88)",
            fontSize: "11px",
            lineHeight: 1.8,
            letterSpacing: "0.5px",
            textShadow: "0 1px 8px rgba(0,0,0,0.35)",
          }}
        >
          NagaSphere · Built around local connections
        </footer>
      </div>
    </main>
  );
}
