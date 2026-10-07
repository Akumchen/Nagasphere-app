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
      <main style={{ padding: "40px", textAlign: "center" }}>
        Loading business profile...
      </main>
    );
  }

    return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f6",
        padding: "24px 16px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/profile"
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#146b4a",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Profile
        </Link>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                width: "110px",
                height: "auto",
                display: "inline-block",
              }}
            />

            <h1
              style={{
                margin: "18px 0 8px",
                color: "#123d2b",
                fontSize: "28px",
              }}
            >
              Business Profile
            </h1>

            <p
              style={{
                margin: 0,
                color: "#66756d",
              }}
            >
              Create your business identity on NagaSphere.
            </p>
          </div>

          {business?.verified && (
            <div
              style={{
                background: "#e8f7ee",
                color: "#17633f",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "20px",
                fontWeight: 600,
              }}
            >
              ✓ Your business profile is verified.
            </div>
          )}

          <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "7px",
              color: "#263b32",
            }}
          >
            Business Name *
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your business name"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d5ddd8",
              marginBottom: "18px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "7px",
              color: "#263b32",
            }}
          >
            Business Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell customers about your business"
            rows={5}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d5ddd8",
              marginBottom: "18px",
              boxSizing: "border-box",
              fontSize: "16px",
              resize: "vertical",
            }}
          />

                    <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "7px",
              color: "#263b32",
            }}
          >
            Business Phone
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Business phone number"
            type="tel"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d5ddd8",
              marginBottom: "18px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "7px",
              color: "#263b32",
            }}
          >
            Business Address
          </label>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, locality or landmark"
            rows={3}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d5ddd8",
              marginBottom: "18px",
              boxSizing: "border-box",
              fontSize: "16px",
              resize: "vertical",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "7px",
              color: "#263b32",
            }}
          >
            City / Town
          </label>

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City or town in Nagaland"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d5ddd8",
              marginBottom: "18px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />

          <div
            style={{
              background: "#f1f5f3",
              padding: "12px 14px",
              borderRadius: "10px",
              marginBottom: "20px",
              color: "#52635a",
              fontSize: "14px",
            }}
          >
            State: <strong>Nagaland</strong>
          </div>

                    {message && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: message.includes("successfully")
                  ? "#e8f7ee"
                  : "#fff1f0",
                color: message.includes("successfully")
                  ? "#17633f"
                  : "#a33a32",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={saveBusiness}
            disabled={saving}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#146b4a",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? "Saving..."
              : business
                ? "Update Business Profile"
                : "Create Business Profile"}
          </button>

          <div style={{ marginTop: "18px", textAlign: "center" }}>
            <Link
              href="/dashboard"
              style={{
                color: "#146b4a",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
