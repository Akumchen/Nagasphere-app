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
      return;
    }

    const finalCategoryId =
      subcategoryId || parentCategoryId || null;

    const { error } = await supabase.from("posts").insert({
      owner_id: auth.user.id,
      type,
      title: title.trim(),
      description: description.trim() || null,
      category_id: finalCategoryId,
      quantity: quantity ? Number(quantity) : null,
      unit: unit.trim() || null,
      budget_min: price ? Number(price) : null,
      budget_max: price ? Number(price) : null,
      city: city.trim() || null,
      state: "Nagaland"
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    router.push("/listing");
  }

  if (loading) {
    return <main style={{ padding: 30 }}>Loading...</main>;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f7f2",
        padding: 20
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{ marginBottom: 20 }}
        >
          ← Back to Dashboard
        </button>

        <section
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 16
          }}
        >
          <h1>Create a Listing</h1>

          <p>
            Tell people in Nagaland what you have or what you need.
          </p>

          <form onSubmit={submit}>
            <label>
              Listing type
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "have" | "need")
                }
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box"
                }}
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
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box"
                }}
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
                  width: "100%",
                  minHeight: 120,
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box",
                  resize: "vertical",
                  display: "block"
                }}
              />
            </label>

            <label>
              Category
              <select
                value={parentCategoryId}
                onChange={(e) =>
                  handleParentCategoryChange(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box"
                }}
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
                  onChange={(e) =>
                    setSubcategoryId(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: 12,
                    margin: "6px 0 16px",
                    boxSizing: "border-box"
                  }}
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
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box"
                }}
              />
            </label>

            <label>
              Unit
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box"
                }}
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
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box"
                }}
              />
            </label>

            <label>
              City / Town
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Example: Dimapur"
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 20px",
                  boxSizing: "border-box"
                }}
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: 14,
                background: "#18251b",
                color: "#fff",
                border: 0,
                borderRadius: 10
              }}
            >
              {saving ? "Publishing..." : "Publish Listing"}
            </button>
          </form>

          {message && <p>{message}</p>}
        </section>
      </div>
    </main>
  );
}
