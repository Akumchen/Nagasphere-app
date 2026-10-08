"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
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

  const [status, setStatus] = useState<
    "active" | "paused" | "closed" | "removed"
  >("active");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const topCategories = useMemo(() => {
    return categories.filter((category) => !category.parent_id);
  }, [categories]);

  const subcategories = useMemo(() => {
    return categories.filter(
      (category) => category.parent_id === parentCategoryId
    );
  }, [categories, parentCategoryId]);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      const [
        { data: listing, error: listingError },
        { data: categoryData, error: categoryError },
      ] = await Promise.all([
        supabase
          .from("posts")
          .select(
            "id,type,title,description,category_id,quantity,unit,budget_min,city,status"
          )
          .eq("id", params.id)
          .eq("owner_id", user.id)
          .maybeSingle(),

        supabase
          .from("categories")
          .select("id,name,slug,parent_id")
          .order("name"),
      ]);

      if (listingError) {
        setMessage(listingError.message);
        setLoading(false);
        return;
      }

      if (categoryError) {
        setMessage(categoryError.message);
        setLoading(false);
        return;
      }

      if (!listing) {
        setMessage(
          "Listing not found or you do not have access to it."
        );
        setLoading(false);
        return;
      }

      const loadedCategories = (categoryData ?? []) as Category[];

      setType(listing.type);
      setTitle(listing.title ?? "");
      setDescription(listing.description ?? "");

      setQuantity(
        listing.quantity == null ? "" : String(listing.quantity)
      );

      setUnit(listing.unit ?? "");

      setPrice(
        listing.budget_min == null ? "" : String(listing.budget_min)
      );

      setCity(listing.city ?? "");
      setStatus(listing.status);
      setCategories(loadedCategories);

      if (listing.category_id) {
        const selectedCategory = loadedCategories.find(
          (category) => category.id === listing.category_id
        );

        if (selectedCategory) {
          if (selectedCategory.parent_id) {
            setParentCategoryId(selectedCategory.parent_id);
            setSubcategoryId(selectedCategory.id);
          } else {
            setParentCategoryId(selectedCategory.id);
            setSubcategoryId("");
          }
        }
      }

      setLoading(false);
    }

    load();
  }, [params.id, router, supabase]);

  function handleParentCategoryChange(value: string) {
    setParentCategoryId(value);
    setSubcategoryId("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      setSaving(false);
      return;
    }

    const finalCategoryId =
      subcategoryId || parentCategoryId || null;

    const { error } = await supabase
      .from("posts")
      .update({
        type,
        title: title.trim(),
        description: description.trim() || null,
        category_id: finalCategoryId,
        quantity: quantity ? Number(quantity) : null,
        unit: unit || null,
        budget_min: price ? Number(price) : null,
        budget_max: price ? Number(price) : null,
        city: city.trim() || null,
      })
      .eq("id", params.id)
      .eq("owner_id", user.id);

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    router.push("/my-listings");
  }

  async function updateStatus(
    nextStatus: "active" | "paused" | "closed"
  ) {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("posts")
      .update({
        status: nextStatus,
      })
      .eq("id", params.id)
      .eq("owner_id", user.id);

    if (error) {
      setMessage(error.message);
    } else {
      setStatus(nextStatus);
    }

    setSaving(false);
  }

    if (loading) {
    return (
      <main style={{ padding: 30 }}>
        Loading listing...
      </main>
    );
  }

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/my-listings")}
          style={{
            marginBottom: 20,
          }}
        >
          ← Back to My Listings
        </button>

        <section
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 16,
          }}
        >
          <h1>Edit Listing</h1>

          <p
            style={{
              color: "#697067",
            }}
          >
            Update your listing details without changing ownership.
          </p>

          <form onSubmit={save}>
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
                  boxSizing: "border-box",
                }}
              >
                <option value="have">
                  I Have Something
                </option>

                <option value="need">
                  I Need Something
                </option>
              </select>
            </label>

            <label>
              Title

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <label>
              Description

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                style={{
                  width: "100%",
                  minHeight: 120,
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box",
                  resize: "vertical",
                  display: "block",
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
                  boxSizing: "border-box",
                }}
              >
                <option value="">
                  Select a category
                </option>

                {topCategories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            {parentCategoryId &&
              subcategories.length > 0 && (
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
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">
                      Select a subcategory
                    </option>

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
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <label>
              Unit

              <select
                value={unit}
                onChange={(e) =>
                  setUnit(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">
                  Select a unit
                </option>

                <option value="kg">
                  kg
                </option>

                <option value="gram">
                  gram
                </option>

                <option value="litre">
                  litre
                </option>

                <option value="piece">
                  piece
                </option>

                <option value="pack">
                  pack
                </option>

                <option value="dozen">
                  dozen
                </option>

                <option value="box">
                  box
                </option>

                <option value="bundle">
                  bundle
                </option>

                <option value="tonne">
                  tonne
                </option>

                <option value="other">
                  other
                </option>
              </select>
            </label>

            <label>
              {type === "have"
                ? "Price"
                : "Budget"}

              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="₹"
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 16px",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <label>
              City / Town

              <input
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                placeholder="Example: Dimapur"
                style={{
                  width: "100%",
                  padding: 12,
                  margin: "6px 0 20px",
                  boxSizing: "border-box",
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
                borderRadius: 10,
              }}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>

          <div
            style={{
              marginTop: 28,
              paddingTop: 22,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <h2>
              Listing status
            </h2>

            <p
              style={{
                color: "#697067",
              }}
            >
              Current status:{" "}
              <strong>{status}</strong>
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {status !== "active" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus("active")
                  }
                  disabled={saving}
                >
                  Set Active
                </button>
              )}

              {status !== "paused" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus("paused")
                  }
                  disabled={saving}
                >
                  Pause
                </button>
              )}

              {status !== "closed" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus("closed")
                  }
                  disabled={saving}
                >
                  Close
                </button>
              )}
            </div>
          </div>

          {message && (
            <p
              style={{
                marginTop: 18,
                color: "#b42318",
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
