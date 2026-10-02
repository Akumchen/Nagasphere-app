"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Category = {
  id: string;
  name: string;
};

export default function CreateListingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [type, setType] = useState<"have" | "need">("have");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPage() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) {
        setMessage(error.message);
      } else {
        setCategories(data ?? []);
      }

      setLoading(false);
    }

    loadPage();
  }, [router, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a title.");
      return;
    }

    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      owner_id: user.id,
      type,
      title: title.trim(),
      description: description.trim() || null,
      category_id: categoryId || null,
      quantity: quantity ? Number(quantity) : null,
      unit: unit.trim() || null,
      budget_min: priceMin ? Number(priceMin) : null,
      budget_max: priceMax ? Number(priceMax) : null,
      location_text: location.trim() || null,
      city: city.trim() || null,
      state: "Nagaland",
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
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
        Loading...
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
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            border: 0,
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            marginBottom: "20px",
            fontSize: "15px",
          }}
        >
          ← Back to Dashboard
        </button>

        <section
          style={{
            background: "white",
            padding: "28px",
            borderRadius: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h1 style={{ marginBottom: "8px" }}>Create a Listing</h1>

          <p
            style={{
              color: "#697067",
              marginBottom: "28px",
              lineHeight: 1.5,
            }}
          >
            Tell people in Nagaland what you have or what you need.
          </p>

          <form onSubmit={handleSubmit}>
            <label style={{ display: "block",
