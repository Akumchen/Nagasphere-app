"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type Listing = {
  id: string;
  owner_id: string;
  type: string;
  title: string;
  description: string | null;
  quantity: number | string | null;
  unit: string | null;
  budget_min: number | string | null;
  budget_max: number | string | null;
  city: string | null;
  state: string | null;
  category_id: string | null;
};

type Category = {
  id: string;
  name: string;
};

type Seller = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

const supabase = createClient();

function formatPrice(
  budgetMin: number | string | null,
  budgetMax: number | string | null,
  unit: string | null
) {
  if (budgetMin == null && budgetMax == null) {
    return "Price on request";
  }

  const min = budgetMin == null ? null : Number(budgetMin);
  const max = budgetMax == null ? null : Number(budgetMax);

  if (min == null || Number.isNaN(min)) {
    return "Price on request";
  }

  const price =
    max != null && !Number.isNaN(max) && max !== min
      ? `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString(
          "en-IN"
        )}`
      : `₹${min.toLocaleString("en-IN")}`;

  return unit ? `${price} / ${unit}` : price;
}

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [listing, setListing] = useState<Listing | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadListing() {
      setLoading(true);
      setError("");

      const { data, error: listingError } = await supabase
        .from("posts")
        .select(
          "id,owner_id,type,title,description,quantity,unit,budget_min,budget_max,city,state,category_id"
        )
        .eq("id", id)
        .eq("status", "active")
        .maybeSingle();

      if (listingError) {
        console.error(listingError);
        setError("Unable to load this listing right now.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          "This listing could not be found or is no longer active."
        );
        setLoading(false);
        return;
      }

      const loadedListing = data as Listing;
      setListing(loadedListing);

      if (loadedListing.category_id) {
        const { data: categoryData, error: categoryError } =
          await supabase
            .from("categories")
            .select("id,name")
            .eq("id", loadedListing.category_id)
            .maybeSingle();

        if (!categoryError && categoryData) {
          setCategory(categoryData as Category);
        }
      }

      const { data: sellerData, error: sellerError } =
        await supabase
          .from("public_seller_profiles")
          .select("id,full_name,avatar_url")
          .eq("id", loadedListing.owner_id)
          .maybeSingle();

      if (!sellerError && sellerData) {
        setSeller(sellerData as Seller);
      }

      setLoading(false);
    }

    loadListing();
  }, [id]);

  if (loading) {
    return (
      <main
        style={{
          padding: "32px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <p>Loading listing...</p>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main
        style={{
          padding: "32px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <button onClick={() => router.push("/")}>
          ← Back to marketplace
        </button>

        <h1 style={{ marginTop: "32px" }}>
          Listing unavailable
        </h1>

        <p style={{ color: "#697067" }}>
          {error || "This listing is no longer available."}
        </p>
      </main>
    );
  }

  const location =
    listing.city && listing.state
      ? `${listing.city}, ${listing.state}`
      : listing.city || listing.state || "Nagaland";

  const listingType =
    listing.type.toLowerCase().includes("need") ||
    listing.type.toLowerCase().includes("request")
      ? "Looking for"
      : "Offering";

  const sellerName =
    seller?.full_name?.trim() || "NagaSphere Seller";

  return (
    <main
      style={{
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <button onClick={() => router.back()}>
          ← Back
        </button>

        <button onClick={() => router.push("/")}>
          Marketplace
        </button>
      </header>

      <section
        style={{
          background: "#fff",
          border: "1px solid #e1ddd2",
          borderRadius: "18px",
          padding: "24px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            height: "180px",
            borderRadius: "14px",
            background: "#dfe5d5",
            display: "grid",
            placeItems: "center",
            fontSize: "64px",
            fontWeight: 800,
            color: "#59674f",
            marginBottom: "24px",
          }}
        >
          {listing.title.charAt(0).toUpperCase()}
        </div>

        <p
          style={{
            margin: "0 0 8px",
            color: "#697067",
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {listingType}
        </p>

        <h1 style={{ margin: "0 0 12px" }}>
          {listing.title}
        </h1>

        <p
          style={{
            margin: "0 0 18px",
            color: "#596057",
          }}
        >
          📍 {location}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div>
            <small style={{ color: "#697067" }}>
              Price
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "4px",
              }}
            >
              {formatPrice(
                listing.budget_min,
                listing.budget_max,
                listing.unit
              )}
            </strong>
          </div>

          <div>
            <small style={{ color: "#697067" }}>
              Quantity
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "4px",
              }}
            >
              {listing.quantity != null
                ? `${listing.quantity}${
                    listing.unit ? ` ${listing.unit}` : ""
                  }`
                : "Not specified"}
            </strong>
          </div>

          <div>
            <small style={{ color: "#697067" }}>
              Category
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "4px",
              }}
            >
              {category?.name || "Other"}
            </strong>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #e8e5dd",
            paddingTop: "22px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Description
          </h2>

          <p
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              color: "#40463f",
            }}
          >
            {listing.description ||
              "No description provided."}
          </p>
        </div>

        <div
          style={{
            marginTop: "28px",
            padding: "20px",
            borderRadius: "14px",
            background: "#f4f5ef",
            border: "1px solid #e2e5da",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Seller Information
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "#dfe5d5",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: "20px",
                color: "#59674f",
              }}
            >
              {sellerName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: "17px",
                }}
              >
                {sellerName}
              </strong>

              <span
                style={{
                  color: "#697067",
                  fontSize: "14px",
                }}
              >
                NagaSphere Seller
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              alert(
                "Messaging will be connected in the NagaSphere messaging section."
              );
            }}
            style={{
              width: "100%",
              padding: "13px 16px",
              border: "none",
              borderRadius: "10px",
              background: "#59674f",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Contact Seller
          </button>
        </div>
      </section>
    </main>
  );
}
