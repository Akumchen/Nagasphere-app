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

          <p style={{ color: "#697067" }}>
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
          <div
  onClick={() => router.push("/my-listings")}
  style={{
    background: "white",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
    cursor: "pointer",
  }}
>
            <h2>My Listings</h2>
            <p style={{ color: "#697067" }}>
              Manage the products and services you offer.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "18px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
            }}
          >
            <h2>My Requests</h2>
            <p style={{ color: "#697067" }}>
              Find products and services you need.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "18px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
            }}
          >
            <h2>Messages</h2>
            <p style={{ color: "#697067" }}>
              Connect with buyers and sellers.
            </p>
          </div>

          <div
            onClick={() => router.push("/profile")}
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "18px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
              cursor: "pointer",
            }}
          >
            <h2>Profile</h2>
            <p style={{ color: "#697067" }}>
              Complete and manage your NagaSphere profile.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
