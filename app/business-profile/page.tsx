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
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f6f7f2",
          color: "#18251b",
          fontSize: "15px",
        }}
      >
        Loading business profile...
      </main>
    );
  }

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        padding: "24px 16px 60px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        {/* Navigation */}
        <div
          style={{
            marginBottom: "18px",
          }}
        >
          <Link
            href="/profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 13px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.68)",
              border: "1px solid rgba(35, 65, 43, 0.14)",
              color: "#18251b",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow:
                "0 6px 16px rgba(7, 29, 19, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            ← Back to Profile
          </Link>
        </div>

        {/* Master NagaSphere premium surface */}
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
              width: "280px",
              height: "280px",
              top: "-160px",
              right: "-100px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0) 72%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Page heading */}
            <div
              style={{
                marginBottom: "28px",
              }}
            >
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
                Business
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
                Business Profile
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#697067",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  maxWidth: "580px",
                }}
              >
                Create and manage your business identity on NagaSphere so
                customers can discover and connect with you.
              </p>
            </div>

            {/* Verification */}
            {business?.verified && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "24px",
                  padding: "13px 15px",
                  borderRadius: "13px",
                  background: "rgba(20, 107, 74, 0.08)",
                  border: "1px solid rgba(20, 107, 74, 0.15)",
                  color: "#146b4a",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#146b4a",
                    color: "#ffffff",
                    fontSize: "13px",
                  }}
                >
                  ✓
                </span>

                Your business profile is verified.
              </div>
            )}

            {/* Business name */}
            <label
              style={{
                display: "block",
                marginBottom: "22px",
                color: "#263229",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              Business Name *
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your business name"
                style={{
                  width: "100%",
                  padding: "14px 15px",
                  marginTop: "8px",
                  border: "1px solid rgba(35, 65, 43, 0.16)",
                  borderRadius: "13px",
                  boxSizing: "border-box",
                  fontSize: "15px",
                  color: "#172018",
                  boxShadow:
                    "0 4px 14px rgba(7, 29, 19, 0.04), inset 0 1px 0 rgba(255,255,255,0.65)",
                }}
              />
            </label>

            {/* Description */}
            <label
              style={{
                display: "block",
                marginBottom: "22px",
                color: "#263229",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              Business Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell customers about your business"
                rows={5}
                style={{
                  width: "100%",
                  padding: "14px 15px",
                  marginTop: "8px",
                  border: "1px solid rgba(35, 65, 43, 0.16)",
                  borderRadius: "13px",
                  boxSizing: "border-box",
                  fontSize: "15px",
                  color: "#172018",
                  resize: "vertical",
                  boxShadow:
                    "0 4px 14px rgba(7, 29, 19, 0.04), inset 0 1px 0 rgba(255,255,255,0.65)",
                }}
              />
            </label>

            {/* Phone */}
            <label
              style={{
                display: "block",
                marginBottom: "22px",
                color: "#263229",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              Business Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Business phone number"
                type="tel"
                style={{
                  width: "100%",
                  padding: "14px 15px",
                  marginTop: "8px",
                  border: "1px solid rgba(35, 65, 43, 0.16)",
                  borderRadius: "13px",
                  boxSizing: "border-box",
                  fontSize: "15px",
                  color: "#172018",
                  boxShadow:
                    "0 4px 14px rgba(7, 29, 19, 0.04), inset 0 1px 0 rgba(255,255,255,0.65)",
                }}
              />
            </label>

            {/* Address */}
            <label
              style={{
                display: "block",
                marginBottom: "22px",
                color: "#263229",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              Business Address
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, locality or landmark"
                rows={3}
                style={{
                  width: "100%",
                  padding: "14px 15px",
                  marginTop: "8px",
                  border: "1px solid rgba(35, 65, 43, 0.16)",
                  borderRadius: "13px",
                  boxSizing: "border-box",
                  fontSize: "15px",
                  color: "#172018",
                  resize: "vertical",
                  boxShadow:
                    "0 4px 14px rgba(7, 29, 19, 0.04), inset 0 1px 0 rgba(255,255,255,0.65)",
                }}
              />
            </label>

            {/* City */}
            <label
              style={{
                display: "block",
                marginBottom: "22px",
                color: "#263229",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              City / Town
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City or town in Nagaland"
                style={{
                  width: "100%",
                  padding: "14px 15px",
                  marginTop: "8px",
                  border: "1px solid rgba(35, 65, 43, 0.16)",
                  borderRadius: "13px",
                  boxSizing: "border-box",
                  fontSize: "15px",
                  color: "#172018",
                  boxShadow:
                    "0 4px 14px rgba(7, 29, 19, 0.04), inset 0 1px 0 rgba(255,255,255,0.65)",
                }}
              />
            </label>

            {/* State */}
            <div
              style={{
                marginBottom: "22px",
                padding: "14px 15px",
                borderRadius: "13px",
                background: "rgba(236, 239, 234, 0.68)",
                border: "1px solid rgba(35, 65, 43, 0.10)",
                color: "#52635a",
                fontSize: "14px",
              }}
            >
              State:{" "}
              <strong
                style={{
                  color: "#263229",
                }}
              >
                Nagaland
              </strong>
            </div>

            {/* Status message */}
            {message && (
              <div
                style={{
                  marginBottom: "18px",
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

            {/* Save */}
            <button
              type="button"
              onClick={saveBusiness}
              disabled={saving}
              style={{
                width: "100%",
                padding: "15px",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "13px",
                background:
                  "linear-gradient(135deg, #18251b 0%, #146b4a 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
                boxShadow:
                  "0 10px 24px rgba(7, 29, 19, 0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {saving
                ? "Saving..."
                : business
                  ? "Update Business Profile"
                  : "Create Business Profile"}
            </button>

            {/* Dashboard */}
            <div
              style={{
                marginTop: "18px",
                textAlign: "center",
              }}
            >
              <Link
                href="/dashboard"
                style={{
                  color: "#146b4a",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
