
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

type Business = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  verified: boolean;
};

const colors = {
  forest: "#183d2c",
  green: "#176747",
  ink: "#202d24",
  muted: "#68766b",
  line: "rgba(37,72,49,0.13)",
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  marginTop: "9px",
  padding: "13px 14px",
  border: `1px solid ${colors.line}`,
  borderRadius: "13px",
  background: "rgba(255,255,251,0.88)",
  color: colors.ink,
  fontSize: "15px",
  lineHeight: 1.5,
};

const labelStyle = {
  display: "block",
  color: colors.ink,
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: 1.5,
};

const bubbleStyle = {
  minWidth: 0,
  padding: "clamp(18px, 3vw, 26px)",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.85)",
  background:
    "linear-gradient(145deg, rgba(255,253,247,0.96), rgba(242,248,239,0.92))",
  boxShadow:
    "0 16px 38px rgba(10,37,24,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

function FieldLabel({
  children,
  optional = false,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <span style={labelStyle}>
      {children}
      {optional && (
        <span
          style={{
            marginLeft: "6px",
            color: "#89938a",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          Optional
        </span>
      )}
    </span>
  );
}

export default function BusinessProfilePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBusiness();
  }, []);

  async function loadBusiness() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage("Unable to load your business profile.");
      setLoading(false);
      return;
    }

    if (data) {
      setBusiness(data);
      setName(data.name || "");
      setDescription(data.description || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setCity(data.city || "");
    }

    setLoading(false);
  }

  async function saveBusiness() {
    if (saving) return;

    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    if (!name.trim()) {
      setMessage("Business name is required.");
      setSaving(false);
      return;
    }

    const businessData = {
      owner_id: user.id,
      name: name.trim(),
      description: description.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
      city: city.trim() || null,
      state: "Nagaland",
    };

    let error;

    if (business) {
      const result = await supabase
        .from("businesses")
        .update(businessData)
        .eq("id", business.id);

      error = result.error;
    } else {
      const result = await supabase
        .from("businesses")
        .insert(businessData)
        .select("*")
        .single();

      error = result.error;

      if (!error && result.data) {
        setBusiness(result.data);
      }
    }

    if (error) {
      console.error(error);
      setMessage(error.message || "Unable to save business profile.");
    } else {
      setMessage("Business profile saved successfully.");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main
        className="nagasphere-inner-page"
        style={{
          minHeight: "100vh",
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
            background: "rgba(255,253,247,0.9)",
            boxShadow: "0 18px 50px rgba(10,37,24,0.12)",
          }}
        >
          Preparing your business space...
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
        padding: "clamp(16px, 3.5vw, 36px) 14px 64px",
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "22px",
            padding: "10px 14px",
            border: "1px solid rgba(255,255,255,0.82)",
            borderRadius: "18px",
            background: "rgba(255,253,247,0.84)",
            boxShadow: "0 8px 24px rgba(10,37,24,0.09)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <Link
            href="/profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: colors.forest,
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "grid",
                placeItems: "center",
                width: "35px",
                height: "35px",
                borderRadius: "12px",
                background: "rgba(23,103,71,0.09)",
                fontSize: "20px",
              }}
            >
              ←
            </span>
            Account
          </Link>

          <img
            src="/nagasphere-logo.png"
            alt="NagaSphere"
            style={{
              display: "block",
              width: "clamp(118px,20vw,158px)",
              height: "auto",
              maxHeight: "49px",
              objectFit: "contain",
            }}
          />

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 13px",
              borderRadius: "12px",
              border: `1px solid ${colors.line}`,
              color: colors.forest,
              background: "rgba(255,255,255,0.72)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Dashboard ↗
          </Link>
        </nav>

        {/* Premium business hero */}
        <section
          style={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(100%,260px),1fr))",
            gap: "26px",
            alignItems: "center",
            padding: "clamp(23px,4vw,42px)",
            marginBottom: "30px",
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.45)",
            background:
              "linear-gradient(120deg,rgba(14,48,32,0.97),rgba(24,77,52,0.95) 57%,rgba(49,91,62,0.91))",
            boxShadow:
              "0 25px 60px rgba(7,29,19,0.25),inset 0 1px 0 rgba(255,255,255,0.15)",
            color: "#fffdf5",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              zIndex: -1,
              width: "320px",
              height: "320px",
              right: "-95px",
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
                marginBottom: "17px",
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
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#d8d5a0",
                }}
              />
              Your business on NagaSphere
            </div>

            <h1
              style={{
                margin: 0,
                maxWidth: "620px",
                color: "#fffdf5",
                fontSize: "clamp(31px,5.2vw,52px)",
                lineHeight: 1.06,
                letterSpacing: "-0.045em",
                fontWeight: 750,
              }}
            >
              Give your business
              <br />
              a place to belong.
            </h1>

            <p
              style={{
                maxWidth: "510px",
                margin: "17px 0 0",
                color: "rgba(255,253,245,0.8)",
                fontSize: "15px",
                lineHeight: 1.8,
              }}
            >
              Build your local identity, share what you do, and help people
              across Nagaland find and connect with your business.
            </p>
          </div>

          {/* Business status bubble */}
          <div
            style={{
              minWidth: 0,
              padding: "22px",
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.13)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                display: "grid",
                placeItems: "center",
                width: "52px",
                height: "52px",
                marginBottom: "17px",
                borderRadius: "17px",
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#fffdf5",
                fontSize: "27px",
              }}
            >
              {business?.verified ? "✓" : "◇"}
            </div>

            <div
              style={{
                color: "rgba(255,253,245,0.7)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Profile status
            </div>

            <div
              style={{
                marginTop: "7px",
                color: "#fffdf5",
                fontSize: "21px",
                fontWeight: 750,
                lineHeight: 1.3,
              }}
            >
              {business?.verified
                ? "Verified business"
                : business
                  ? "Profile created"
                  : "Your story starts here"}
            </div>

            <p
              style={{
                margin: "9px 0 0",
                color: "rgba(255,253,245,0.78)",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              {business?.verified
                ? "Your business has verified status on NagaSphere."
                : business
                  ? "Review your details below and keep your information current."
                  : "Add your business details below to establish your presence."}
            </p>
          </div>
        </section>

        {/* Form introduction */}
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            margin: "0 4px 17px",
          }}
        >
          <div>
            <div
              style={{
                marginBottom: "7px",
                color: colors.green,
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Your business details
            </div>

            <h2
              style={{
                margin: 0,
                color: colors.ink,
                fontSize: "clamp(23px,3.5vw,31px)",
                lineHeight: 1.2,
                letterSpacing: "-0.035em",
              }}
            >
              Make it yours.
            </h2>
          </div>

          <span
            style={{
              padding: "8px 11px",
              borderRadius: "999px",
              border: `1px solid ${colors.line}`,
              background: "rgba(255,253,247,0.85)",
              color: colors.muted,
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            * Required field
          </span>
        </div>

        {/* Two separate content bubbles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(100%,320px),1fr))",
            gap: "18px",
            alignItems: "start",
          }}
        >
          {/* Business identity */}
          <section style={bubbleStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "13px",
                marginBottom: "24px",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  width: "44px",
                  height: "44px",
                  borderRadius: "15px",
                  background: "rgba(23,103,71,0.1)",
                  border: "1px solid rgba(23,103,71,0.12)",
                  color: colors.green,
                  fontSize: "22px",
                }}
              >
                ✳
              </div>

              <div>
                <h3
                  style={{
                    margin: "1px 0 5px",
                    color: colors.ink,
                    fontSize: "19px",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Business identity
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: colors.muted,
                    fontSize: "13px",
                    lineHeight: 1.65,
                  }}
                >
                  The name and story people will associate with your business.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>
                <FieldLabel>Business name *</FieldLabel>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your business name"
                  autoComplete="organization"
                  style={inputStyle}
                />
              </label>
            </div>

            <label>
              <FieldLabel optional>About your business</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What do you offer? What makes your business special?"
                rows={6}
                style={{
                  ...inputStyle,
                  minHeight: "148px",
                  resize: "vertical",
                }}
              />
            </label>

            <div
              style={{
                marginTop: "18px",
                padding: "13px 14px",
                borderRadius: "14px",
                background: "rgba(23,103,71,0.055)",
                border: "1px solid rgba(23,103,71,0.1)",
                color: colors.muted,
                fontSize: "12px",
                lineHeight: 1.65,
              }}
            >
              <strong style={{ color: colors.forest }}>
                A useful introduction
              </strong>
              <br />
              Describe your products or services clearly so customers know
              what to expect.
            </div>
          </section>

          {/* Contact and location */}
          <section style={bubbleStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "13px",
                marginBottom: "24px",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  width: "44px",
                  height: "44px",
                  borderRadius: "15px",
                  background: "rgba(184,147,79,0.13)",
                  border: "1px solid rgba(184,147,79,0.16)",
                  color: "#80632c",
                  fontSize: "22px",
                }}
              >
                ⌖
              </div>

              <div>
                <h3
                  style={{
                    margin: "1px 0 5px",
                    color: colors.ink,
                    fontSize: "19px",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Contact & location
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: colors.muted,
                    fontSize: "13px",
                    lineHeight: 1.65,
                  }}
                >
                  Give customers a clear way to reach you and find your area.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>
                <FieldLabel optional>Business phone</FieldLabel>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Business contact number"
                  type="tel"
                  autoComplete="tel"
                  style={inputStyle}
                />
              </label>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>
                <FieldLabel optional>Business address</FieldLabel>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, locality or nearby landmark"
                  rows={3}
                  autoComplete="street-address"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </label>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>
                <FieldLabel optional>City / town</FieldLabel>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dimapur, Kohima, Mokokchung"
                  autoComplete="address-level2"
                  style={inputStyle}
                />
              </label>
            </div>

            <div
              style={{
                padding: "15px",
                borderRadius: "15px",
                background:
                  "linear-gradient(120deg,rgba(23,103,71,0.09),rgba(23,103,71,0.035))",
                border: "1px solid rgba(23,103,71,0.12)",
              }}
            >
              <div
                style={{
                  color: colors.muted,
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Your region
              </div>
              <div
                style={{
                  marginTop: "5px",
                  color: colors.forest,
                  fontSize: "17px",
                  fontWeight: 750,
                }}
              >
                Nagaland, India
              </div>
              <p
                style={{
                  margin: "5px 0 0",
                  color: colors.muted,
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                Your business profile is associated with Nagaland.
              </p>
            </div>
          </section>
        </div>

        {/* Save area */}
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "18px",
            marginTop: "20px",
            padding: "clamp(18px,3vw,25px)",
            borderRadius: "22px",
            border: "1px solid rgba(255,255,255,0.85)",
            background:
              "linear-gradient(120deg,rgba(255,253,247,0.96),rgba(238,245,234,0.94))",
            boxShadow: "0 14px 34px rgba(10,37,24,0.1)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <div style={{ flex: "1 1 230px", minWidth: 0 }}>
            <div
              style={{
                color: colors.ink,
                fontSize: "16px",
                fontWeight: 750,
              }}
            >
              {business ? "Keep your profile up to date" : "Ready to begin?"}
            </div>
            <p
              style={{
                margin: "6px 0 0",
                color: colors.muted,
                fontSize: "13px",
                lineHeight: 1.65,
              }}
            >
              {business
                ? "Save your latest details when you're finished."
                : "Save your details to create your business profile."}
            </p>
          </div>

          <button
            type="button"
            onClick={saveBusiness}
            disabled={saving}
            style={{
              flex: "0 1 290px",
              width: "100%",
              minHeight: "51px",
              padding: "14px 20px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "15px",
              background: saving
                ? "#547363"
                : "linear-gradient(125deg,#183d2c,#176747 65%,#247b53)",
              color: "#fffdf5",
              fontSize: "14px",
              fontWeight: 800,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.8 : 1,
              boxShadow:
                "0 10px 25px rgba(16,51,35,0.22),inset 0 1px 0 rgba(255,255,255,0.17)",
            }}
          >
            {saving
              ? "Saving your details..."
              : business
                ? "Save business changes →"
                : "Create business profile →"}
          </button>
        </section>

        {/* Feedback */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "11px",
              marginTop: "16px",
              padding: "15px 17px",
              borderRadius: "16px",
              border: statusIsSuccess
                ? "1px solid rgba(23,103,71,0.18)"
                : "1px solid rgba(150,55,40,0.18)",
              background: statusIsSuccess
                ? "rgba(238,248,239,0.96)"
                : "rgba(255,244,240,0.96)",
              color: statusIsSuccess ? colors.green : "#8a392d",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            <span aria-hidden="true">
              {statusIsSuccess ? "✓" : "!"}
            </span>
            <span>{message}</span>
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "12px 22px",
            marginTop: "28px",
            color: "rgba(255,253,247,0.94)",
            fontSize: "12px",
            fontWeight: 600,
            textShadow: "0 1px 8px rgba(0,0,0,0.25)",
          }}
        >
          <span>Rooted in Nagaland.</span>
          <span aria-hidden="true">✦</span>
          <span>Built for local connections.</span>
          <Link
            href="/dashboard"
            style={{
              color: "inherit",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.45)",
              paddingBottom: "2px",
            }}
          >
            Return to dashboard
          </Link>
        </footer>
      </div>
    </main>
  );
}
