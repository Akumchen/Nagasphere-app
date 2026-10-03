"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      setEmail(user.email ?? "");
      setLoading(false);
    }

    loadUser();
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
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
        Loading your dashboard...
      </main>
    );
  }

  const cards = [
    {
      title: "My Listings",
      description: "Manage the products and services you offer.",
      path: "/my-listings",
    },
    {
      title: "My Requests",
      description: "Manage the products and services you are looking for.",
      path: "/my-requests",
    },
    {
      title: "Messages",
      description: "Connect with buyers and sellers.",
      path: null,
    },
    {
      title: "Profile",
      description: "Complete and manage your NagaSphere profile.",
      path: "/profile",
    },
  ];

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
          <img
            src="/nagasphere-logo.png"
            alt="NagaSphere"
            style={{
              width: "170px",
              height: "auto",
            }}
          />

          <button
            type="button"
            onClick={handleLogout}
            style={{
              border: "1px solid #d7dcd5",
              background: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </header>

        <section style={{ marginTop: "28px" }}>
          <h1 style={{ marginBottom: "8px" }}>
            Welcome to NagaSphere
          </h1>

          <p
            style={{
              color: "#697067",
              margin: 0,
            }}
          >
            {email}
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginTop: "28px",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => {
                if (card.path) {
                  router.push(card.path);
                }
              }}
              role={card.path ? "button" : undefined}
              tabIndex={card.path ? 0 : undefined}
              onKeyDown={(event) => {
                if (
                  card.path &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  router.push(card.path);
                }
              }}
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                cursor: card.path ? "pointer" : "default",
                transition: "transform 0.15s ease",
              }}
            >
              <h2 style={{ marginTop: 0 }}>{card.title}</h2>

              <p
                style={{
                  color: "#697067",
                  lineHeight: 1.5,
                  marginBottom: 0,
                }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
