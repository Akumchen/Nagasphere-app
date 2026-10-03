"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

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

    setSaving(false);
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
        Loading your profile...
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
          maxWidth: "700px",
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
            marginBottom: "20px",
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
            }}
          >
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                width: "150px",
                height: "auto",
                display: "block",
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={{
              border: "1px solid #d7dcd5",
              background: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
        </header>

        <section
          style={{
            background: "white",
            padding: "28px",
            borderRadius: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h1 style={{ marginBottom: "8px" }}>My Profile</h1>

          <p style={{ color: "#697067", marginBottom: "28px" }}>
            Manage your NagaSphere account information.
          </p>

          <form onSubmit={handleSave}>
            <label style={{ display: "block", marginBottom: "20px" }}>
              Email
              <input
                type="email"
                value={email}
                disabled
                style={{
                  width: "100%",
                  padding: "13px",
                  marginTop: "7px",
                  border: "1px solid #d7dcd5",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                  background: "#f3f4f1",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "20px" }}>
              Full name
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "13px",
                  marginTop: "7px",
                  border: "1px solid #d7dcd5",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "24px" }}>
              Phone number
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
                style={{
                  width: "100%",
                  padding: "13px",
                  marginTop: "7px",
                  border: "1px solid #d7dcd5",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "14px",
                border: 0,
                borderRadius: "10px",
                background: "#18251b",
                color: "white",
                fontWeight: 600,
                cursor: saving ? "wait" : "pointer",
              }}
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "18px",
                color: "#59615a",
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
