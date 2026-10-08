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
          color: "#18251b",
          fontSize: "15px",
        }}
      >
        Loading your profile...
      </main>
    );
  }

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        {/* Premium inner-page header */}
        <header
          style={{
            borderRadius: "22px",
            padding: "13px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "22px",
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
                width: "132px",
                height: "auto",
                display: "block",
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={{
              border: "1px solid rgba(35, 65, 43, 0.16)",
              background: "rgba(255, 255, 255, 0.72)",
              color: "#18251b",
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow:
                "0 6px 16px rgba(7, 29, 19, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            Dashboard
          </button>
        </header>

        {/* Master NagaSphere premium content surface */}
        <section
          style={{
            position: "relative",
            background:
              "linear-gradient(135deg, rgba(255, 253, 247, 0.96) 0%, rgba(244, 248, 241, 0.93) 48%, rgba(226, 237, 226, 0.90) 100%)",
            padding: "34px",
            borderRadius: "26px",
            border: "1px solid rgba(255, 255, 255, 0.92)",
            boxShadow:
              "0 28px 70px rgba(7, 29, 19, 0.25), 0 8px 24px rgba(7, 29, 19, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.96), inset 0 -1px 0 rgba(27, 60, 38, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            overflow: "hidden",
          }}
        >
          {/* Subtle premium glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "260px",
              height: "260px",
              top: "-150px",
              right: "-100px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 72%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: "30px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 11px",
                  marginBottom: "12px",
                  borderRadius: "999px",
                  background: "rgba(20, 107, 74, 0.08)",
                  border: "1px solid rgba(20, 107, 74, 0.12)",
                  color: "#146b4a",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Account
              </div>

              <h1
                style={{
                  margin: 0,
                  color: "#18251b",
                  fontSize: "clamp(28px, 5vw, 38px)",
                  lineHeight: 1.12,
                  letterSpacing: "-0.03em",
                }}
              >
                My Profile
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#697067",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  maxWidth: "560px",
                }}
              >
                Manage your NagaSphere account information and keep your
                marketplace profile up to date.
              </p>
            </div>

            <form onSubmit={handleSave}>
              {/* Email */}
              <label
                style={{
                  display: "block",
                  marginBottom: "22px",
                  color: "#263229",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Email
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "14px 15px",
                    marginTop: "8px",
                    border: "1px solid rgba(35, 65, 43, 0.16)",
                    borderRadius: "13px",
                    boxSizing: "border-box",
                    background: "rgba(236, 239, 234, 0.78)",
                    color: "#697067",
                    fontSize: "15px",
                    boxShadow:
                      "inset 0 1px 2px rgba(7, 29, 19, 0.04)",
                  }}
                />
              </label>

              {/* Full name */}
              <label
                style={{
                  display: "block",
                  marginBottom: "22px",
                  color: "#263229",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Full name
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "14px 15px",
                    marginTop: "8px",
                    border: "1px solid rgba(35, 65, 43, 0.16)",
                    borderRadius: "13px",
                    boxSizing: "border-box",
                    color: "#172018",
                    fontSize: "15px",
                    boxShadow:
                      "0 4px 14px rgba(7, 29, 19, 0.04), inset 0 1px 0 rgba(255,255,255,0.65)",
                  }}
                />
              </label>

              {/* Phone */}
              <label
                style={{
                  display: "block",
                  marginBottom: "26px",
                  color: "#263229",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Phone number
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your phone number"
                  style={{
                    width: "100%",
                    padding: "14px 15px",
                    marginTop: "8px",
                    border: "1px solid rgba(35, 65, 43, 0.16)",
                    borderRadius: "13px",
                    boxSizing: "border-box",
                    color: "#172018",
                    fontSize: "15px",
                    boxShadow:
                      "0 4px 14px rgba(7, 29, 19, 0.04), inset 0 1px 0 rgba(255,255,255,0.65)",
                  }}
                />
              </label>

              {/* Save */}
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: "13px",
                  background:
                    "linear-gradient(135deg, #18251b 0%, #146b4a 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: saving ? "wait" : "pointer",
                  boxShadow:
                    "0 10px 24px rgba(7, 29, 19, 0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </form>

            {/* Business profile action */}
            <button
              type="button"
              onClick={() => router.push("/business-profile")}
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "14px",
                border: "1px solid rgba(35, 65, 43, 0.16)",
                borderRadius: "13px",
                background: "rgba(255, 255, 255, 0.58)",
                color: "#18251b",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow:
                  "0 6px 18px rgba(7, 29, 19, 0.06), inset 0 1px 0 rgba(255,255,255,0.75)",
              }}
            >
              Business Profile
            </button>

            {/* Status message */}
            {message && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "13px 15px",
                  borderRadius: "12px",
                  background: message.includes("successfully")
                    ? "rgba(20, 107, 74, 0.08)"
                    : "rgba(150, 55, 40, 0.08)",
                  border: message.includes("successfully")
                    ? "1px solid rgba(20, 107, 74, 0.14)"
                    : "1px solid rgba(150, 55, 40, 0.14)",
                  color: message.includes("successfully")
                    ? "#146b4a"
                    : "#8a392d",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {message}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
