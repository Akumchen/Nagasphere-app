"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type RequestItem = {
  id: string;
  type: "have" | "need";
  title: string;
  description: string | null;
  quantity: number | null;
  unit: string | null;
  budget_min: number | null;
  city: string | null;
  state: string | null;
  category_id: string | null;
  status: "active" | "paused" | "closed" | "removed";
  created_at: string;
};

type Category = {
  id: string;
  name: string;
};

export default function MyRequestsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadRequests() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      return;
    }

    const [
      { data: requestData, error: requestError },
      { data: categoryData },
    ] = await Promise.all([
      supabase
        .from("posts")
        .select(
          "id,type,title,description,quantity,unit,budget_min,city,state,category_id,status,created_at"
        )
        .eq("owner_id", user.id)
        .eq("type", "need")
        .order("created_at", { ascending: false }),

      supabase
        .from("categories")
        .select("id,name")
        .order("name"),
    ]);

    if (requestError) {
      setMessage(requestError.message);
      setLoading(false);
      return;
    }

    const categoryMap: Record<string, string> = {};

    (categoryData as Category[] | null)?.forEach((category) => {
      categoryMap[category.id] = category.name;
    });

    setCategories(categoryMap);
    setRequests((requestData ?? []) as RequestItem[]);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function changeStatus(
    id: string,
    status: "active" | "paused" | "closed"
  ) {
    setBusyId(id);
    setMessage("");

    const { data, error } = await supabase
      .from("posts")
      .update({ status })
      .eq("id", id)
      .select("id,status")
      .maybeSingle();

    if (error) {
      setMessage(error.message);
    } else if (!data) {
      setMessage(
        "The request status was not changed. Please try again."
      );
    } else {
      setRequests((current) =>
        current.map((request) =>
          request.id === id
            ? {
                ...request,
                status: data.status as RequestItem["status"],
              }
            : request
        )
      );
    }

    setBusyId(null);
  }

  async function deleteRequest(id: string) {
    if (!window.confirm("Delete this request permanently?")) {
      return;
    }

    setBusyId(id);
    setMessage("");

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
    } else {
      setRequests((current) =>
        current.filter((request) => request.id !== id)
      );
    }

    setBusyId(null);
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 24,
          background: "#f6f7f2",
        }}
      >
        Loading your requests...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f7f2",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            marginBottom: 18,
          }}
        >
          ← Back to Dashboard
        </button>

        <header style={{ marginBottom: 24 }}>
          <h1 style={{ marginBottom: 8 }}>My Requests</h1>

          <p
            style={{
              color: "#697067",
              margin: 0,
            }}
          >
            Manage the products and services you are looking for.
          </p>
        </header>

        {message && (
          <p
            style={{
              color: "#b42318",
              marginBottom: 18,
            }}
          >
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/create-listing")}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 20,
            border: 0,
            borderRadius: 10,
            background: "#18251b",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          + Create New Request
        </button>

        {requests.length === 0 ? (
          <section
            style={{
              background: "#fff",
              padding: 32,
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <h2>No requests yet</h2>

            <p style={{ color: "#697067" }}>
              Create a request when you are looking for a product or service.
            </p>

            <button
              type="button"
              onClick={() => router.push("/create-listing")}
              style={{
                marginTop: 10,
                padding: "11px 16px",
                borderRadius: 10,
              }}
            >
              Create a Request
            </button>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            {requests.map((request) => (
              <article
                key={request.id}
                style={{
                  background
