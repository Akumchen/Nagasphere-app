"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

type Business = {
  id: string;
  name: string;
};

export default function CreateListingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [type, setType] = useState<"have" | "need">("have");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessId, setBusinessId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const topCategories = useMemo(
    () => categories.filter((category) => !category.parent_id),
    [categories]
  );

  const subcategories = useMemo(
    () =>
      categories.filter(
        (category) => category.parent_id === parentCategoryId
      ),
    [categories, parentCategoryId]
  );

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        router.replace("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("categories")
        .select("id,name,slug,parent_id")
        .order("name");

      if (error) {
        setMessage(error.message);
      } else {
        setCategories(data || []);
      }

      const { data: businessData, error: businessError } =
        await supabase
          .from("businesses")
          .select("id,name")
          .eq("owner_id", auth.user.id)
          .maybeSingle();

      if (!businessError && businessData) {
        setBusiness(businessData);
      }

      setLoading(false);
    }

    load();
  }, [router, supabase]);

  function handleParentCategoryChange(value: string) {
    setParentCategoryId(value);
    setSubcategoryId("");
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a title.");
      return;
    }

    if (!parentCategoryId) {
      setMessage("Please select a category.");
      return;
    }

    if (subcategories.length > 0 && !subcategoryId) {
      setMessage("Please select a subcategory.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      router.replace("/auth");
      setSaving(false);
      return;
    }

    const finalCategoryId =
      subcategoryId || parentCategoryId || null;

    const { error } = await supabase.from("posts").insert({
      owner_id: auth.user.id,
      type,
      title: title.trim(),
      description: description.trim() || null,
      business_id: businessId || null,
      category_id: finalCategoryId,
      quantity: quantity ? Number(quantity) : null,
      unit: unit.trim() || null,
      budget_min: price ? Number(price) : null,
      budget_max: price ? Number(price) : null,
      city: city.trim() || null,
      state: "Nagaland",
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    router.push("/listing");
  }

  const fieldStyle = {
    width: "100%",
    padding: "12px 14px",
    margin: "7px 0 17px",
    boxSizing: "border-box" as const,
    border: "1px solid rgba(49,82,55,0.2)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.82)",
    color: "#26392b",
    fontSize: 14,
  };

  if (loading) {
    return (
      <main
        className="nagasphere-inner-page"
        style={{
          minHeight: "100vh",
          padding: "clamp(18px, 4vw, 34px)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            color: "#fffdf7",
            textShadow: "0 2px 12px rgba(0,0,0,0.24)",
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>
            NAGASPHERE
          </p>
          <h1 style={{ margin: "10px 0" }}>
            Preparing your listing form…
          </h1>
          <p style={{ margin: 0 }}>
            Loading your categories and account details.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        padding: "clamp(18px, 4vw, 34px)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Compact brand header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "clamp(17px, 3vw, 24px)",
            marginBottom: 20,
            borderRadius: 22,
            border: "1px solid rgba(255,253,247,0.3)",
            background:
              "linear-gradient(135deg, rgba(13,43,29,0.86), rgba(28,61,40,0.62))",
            boxShadow: "0 14px 36px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <img
            src="/nagasphere-logo.png"
            alt="NagaSphere"
            style={{
              width: 66,
              height: 66,
              flex: "0 0 66px",
              objectFit: "contain",
              borderRadius: 15,
              background: "rgba(255,253,247,0.96)",
              padding: 5,
              boxSizing: "border-box",
            }}
          />

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: "0 0 6px",
                color: "#dbe8d8",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.15em",
              }}
            >
              NAGALAND&apos;S LOCAL MARKETPLACE
            </p>

            <h1
              style={{
                margin: 0,
                color: "#fffdf7",
                fontSize: "clamp(22px, 4vw, 31px)",
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
              }}
            >
              What you have. What you need.
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#edf2e9",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Create a listing for people and businesses across Nagaland.
            </p>
          </div>
        </header>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            marginBottom: 18,
            padding: "10px 14px",
            border: "1px solid rgba(255,253,247,0.42)",
            borderRadius: 999,
            background: "rgba(255,253,247,0.94)",
            color: "#24432d",
            fontSize: 13,
            fontWeight: 750,
            cursor: "pointer",
            boxShadow: "0 5px 16px rgba(0,0,0,0.12)",
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Main premium form card */}
        <section
          style={{
            background:
              "linear-gradient(145deg, rgba(255,253,247,0.98), rgba(244,247,238,0.97))",
            padding: "clamp(20px, 4vw, 32px)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.78)",
            boxShadow:
              "0 20px 55px rgba(6,28,16,0.24), inset 0 1px 0 rgba(255,255,255,0.9)",
            color: "#26392b",
          }}
        >
          <p
            style={{
              margin: "0 0 7px",
              color: "#66806a",
              fontSize: 11,
              fontWeight: 850,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            NEW MARKETPLACE POST
          </p>

          <h2
            style={{
              margin: "0 0 9px",
              color: "#203a28",
              fontSize: "clamp(24px, 4vw, 30px)",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
            }}
          >
            Create a Listing
          </h2>

          <p
            style={{
              margin: "0 0 24px",
              color: "#627064",
              fontSize: 14,
              lineHeight: 1.75,
            }}
          >
            Tell people in Nagaland what you have to offer or what you need.
            Clear details help the right people find you.
          </p>

          <form onSubmit={submit}>
            <label>
              Listing type
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "have" | "need")
                }
                style={fieldStyle}
              >
                <option value="have">I Have Something</option>
                <option value="need">I Need Something</option>
              </select>
            </label>

            <label>
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Fresh Naga King Chilli"
                style={fieldStyle}
              />
            </label>

            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product or requirement."
                rows={4}
                style={{
                  ...fieldStyle,
                  minHeight: 120,
                  display: "block",
                  resize: "vertical",
                }}
              />
            </label>

            {business && (
              <label>
                Business Profile
                <select
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  style={fieldStyle}
                >
                  <option value="">Personal Listing</option>
                  <option value={business.id}>{business.name}</option>
                </select>
              </label>
            )}

            <label>
              Category
              <select
                value={parentCategoryId}
                onChange={(e) =>
                  handleParentCategoryChange(e.target.value)
                }
                style={fieldStyle}
              >
                <option value="">Select a category</option>

                {topCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            {parentCategoryId && subcategories.length > 0 && (
              <label>
                Subcategory
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  style={fieldStyle}
                >
                  <option value="">Select a subcategory</option>

                  {subcategories.map((subcategory) => (
                    <option
                      key={subcategory.id}
                      value={subcategory.id}
                    >
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Quantity
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={fieldStyle}
              />
            </label>

            <label>
              Unit
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={fieldStyle}
              >
                <option value="">Select a unit</option>
                <option value="kg">kg</option>
                <option value="gram">gram</option>
                <option value="litre">litre</option>
                <option value="piece">piece</option>
                <option value="pack">pack</option>
                <option value="dozen">dozen</option>
                <option value="box">box</option>
                <option value="bundle">bundle</option>
                <option value="tonne">tonne</option>
                <option value="other">other</option>
              </select>
            </label>

            <label>
              {type === "have" ? "Price" : "Budget"}
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="₹"
                style={fieldStyle}
              />
            </label>

            <label>
              City / Town
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Example: Dimapur"
                style={{
                  ...fieldStyle,
                  marginBottom: 21,
                }}
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "15px 18px",
                background: "linear-gradient(135deg, #234b31, #152d1e)",
                color: "#fffdf7",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 13,
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.01em",
                cursor: saving ? "wait" : "pointer",
                boxShadow: "0 9px 20px rgba(24,55,33,0.2)",
              }}
            >
              {saving ? "Publishing..." : "Publish Listing"}
            </button>
          </form>

          {message && (
            <div
              role="status"
              style={{
                marginTop: 18,
                padding: "12px 14px",
                border: "1px solid rgba(163,49,49,0.18)",
                borderRadius: 12,
                background: "rgba(255,244,240,0.9)",
                color: "#923b32",
                fontSize: 13,
                lineHeight: 1.6,
                overflowWrap: "anywhere",
              }}
            >
              {message}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
