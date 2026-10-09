
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const colors = {
  green: "#173b2b",
  deepGreen: "#10291e",
  muted: "#637267",
  border: "rgba(255,255,255,0.72)",
  glass: "rgba(250,249,241,0.93)",
  softGlass: "rgba(250,249,241,0.78)",
};

const buttonStyle = {
  border: "1px solid rgba(31,65,47,0.20)",
  background: "rgba(255,255,255,0.76)",
  color: colors.green,
  padding: "10px 15px",
  borderRadius: "11px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 650,
  minHeight: "42px",
};

const cards = [
  {
    title: "My Listings",
    description:
      "Manage the products and services you offer across Nagaland.",
    path: "/my-listings",
    icon: "◇",
    label: "Your marketplace offers",
  },
  {
    title: "My Requests",
    description:
      "Keep track of the products and services you are looking for.",
    path: "/my-requests",
    icon: "⌁",
    label: "What you need",
  },
  {
    title: "Messages",
    description:
      "Continue conversations with buyers and sellers.",
    path: "/messages",
    icon: "✉",
    label: "Your conversations",
  },
  {
    title: "My Profile",
    description:
      "Manage your profile and the details people see about you.",
    path: "/profile",
    icon: "○",
    label: "Your account",
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

  const pageStyle = {
    minHeight: "100vh",
    boxSizing: "border-box" as const,
    padding: "clamp(14px, 3.5vw, 34px) clamp(12px, 3vw, 24px) 48px",
  };

  const shellStyle = {
    width: "100%",
    maxWidth: "1080px",
    margin: "0 auto",
  };

  const panelStyle = {
    border: `1px solid ${colors.border}`,
    background:
      "linear-gradient(135deg, rgba(250,249,241,0.96), rgba(238,241,225,0.89))",
    boxShadow: "0 18px 46px rgba(5,25,15,0.19)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
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
        Checking your account...
      </main>
    );
  }

  return (
    <main className="nagasphere-inner-page" style={pageStyle}>
      <div style={shellStyle}>
        <header
          style={{
            ...panelStyle,
            borderRadius: "18px",
            padding: "12px 15px",
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
                maxHeight: "58px",
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
              background: colors.green,
              borderColor: colors.green,
              color: "#fffdf4",
              opacity: signingOut ? 0.7 : 1,
              cursor: signingOut ? "wait" : "pointer",
            }}
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </header>

        <section
          style={{
            ...panelStyle,
            marginTop: "22px",
            padding: "clamp(22px, 5vw, 36px)",
            borderRadius: "22px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid rgba(31,65,47,0.15)",
              background: "rgba(255,255,255,0.66)",
              borderRadius: "999px",
              padding: "7px 12px",
              color: colors.green,
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
            }}
          >
            <span aria-hidden="true">✦</span>
            Your marketplace
          </div>

          <h1
            style={{
              margin: "17px 0 10px",
              color: colors.deepGreen,
              fontSize: "clamp(29px, 6vw, 43px)",
              lineHeight: 1.12,
              letterSpacing: "-1.2px",
              fontWeight: 750,
            }}
          >
            Welcome to NagaSphere
          </h1>

          <p
            style={{
              margin: 0,
              color: colors.muted,
              fontSize: "15px",
              lineHeight: 1.7,
              overflowWrap: "anywhere",
            }}
          >
            {email}
          </p>

          <div
            style={{
              height: "1px",
              background: "rgba(31,65,47,0.13)",
              margin: "23px 0 21px",
            }}
          />

          <h2
            style={{
              margin: 0,
              color: colors.deepGreen,
              fontSize: "clamp(21px, 4vw, 27px)",
              lineHeight: 1.3,
              letterSpacing: "-0.5px",
              fontWeight: 750,
            }}
          >
            Your NagaSphere
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color: colors.muted,
              fontSize: "14px",
              lineHeight: 1.75,
              maxWidth: "600px",
            }}
          >
            Everything you need to manage your marketplace activity,
            connect with people, and discover opportunities across Nagaland.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 245px), 1fr))",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            {cards.map((card, index) => (
              <button
                key={card.title}
                type="button"
                onClick={() => router.push(card.path)}
                aria-label={`Open ${card.title}`}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "left",
                  minWidth: 0,
                  minHeight: "208px",
                  padding: "22px",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.84)",
                  background:
                    index % 2 === 0
                      ? "linear-gradient(145deg, rgba(255,255,251,0.90), rgba(232,239,221,0.90))"
                      : "linear-gradient(145deg, rgba(242,246,232,0.94), rgba(224,235,216,0.91))",
                  boxShadow: "0 10px 27px rgba(17,48,30,0.09)",
                  cursor: "pointer",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-3px)";
                  event.currentTarget.style.boxShadow =
                    "0 15px 32px rgba(17,48,30,0.15)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                  event.currentTarget.style.boxShadow =
                    "0 10px 27px rgba(17,48,30,0.09)";
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "-32px",
                    top: "-38px",
                    width: "118px",
                    height: "118px",
                    borderRadius: "50%",
                    background: "rgba(177,205,169,0.22)",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "47px",
                      height: "47px",
                      marginBottom: "18px",
                      borderRadius: "15px",
                      border: "1px solid rgba(31,65,47,0.13)",
                      background: "rgba(255,255,255,0.73)",
                      color: colors.green,
                      fontSize: "25px",
                    }}
                  >
                    {card.icon}
                  </div>

                  <p
                    style={{
                      margin: "0 0 7px",
                      color: "#778376",
                      fontSize: "10px",
                      fontWeight: 800,
                      letterSpacing: "1.1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {card.label}
                  </p>

                  <h3
                    style={{
                      margin: 0,
                      color: colors.deepGreen,
                      fontSize: "21px",
                      lineHeight: 1.3,
                      letterSpacing: "-0.35px",
                      fontWeight: 750,
                    }}
                  >
                    {card.title}
                  </h3>

                  <p
                    style={{
                      margin: "9px 0 18px",
                      color: colors.muted,
                      fontSize: "13px",
                      lineHeight: 1.7,
                    }}
                  >
                    {card.description}
                  </p>

                  <span
                    style={{
                      display: "inline-block",
                      color: colors.green,
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Open section&nbsp; →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section
          style={{
            ...panelStyle,
            marginTop: "17px",
            padding: "clamp(19px, 4vw, 25px)",
            borderRadius: "18px",
            display: "flex",
            alignItems: "flex-start",
            gap: "15px",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              flex: "0 0 42px",
              width: "42px",
              height: "42px",
              display: "grid",
              placeItems: "center",
              borderRadius: "14px",
              background: "rgba(31,65,47,0.09)",
              color: colors.green,
              fontSize: "22px",
            }}
          >
            ✦
          </div>

          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: "1px 0 6px",
                color: colors.deepGreen,
                fontSize: "17px",
                fontWeight: 750,
              }}
            >
              A marketplace built around you
            </h2>

            <p
              style={{
                margin: 0,
                color: colors.muted,
                fontSize: "13px",
                lineHeight: 1.8,
              }}
            >
              Discover local products and services, connect with people
              across Nagaland, and manage your marketplace activity in
              one place.
            </p>
          </div>
        </section>

        <footer
          style={{
            padding: "20px 8px 0",
            textAlign: "center",
            color: "rgba(255,253,244,0.88)",
            fontSize: "12px",
            lineHeight: 1.7,
            textShadow: "0 1px 8px rgba(0,0,0,0.28)",
          }}
        >
          NagaSphere · Local Needs, Global Reach
        </footer>
      </div>
    </main>
  );
}
