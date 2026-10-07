"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("mode") === "signup") {
      setMode("signup");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Account created. Check your email if confirmation is required."
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "32px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            border: 0,
            background: "transparent",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to NagaSphere
        </button>

        <h1 style={{ marginBottom: "8px" }}>NagaSphere</h1>

        <p style={{ color: "#697067", marginBottom: "24px" }}>
          {mode === "signin"
            ? "Sign in to your account"
            : "Create your NagaSphere account"}
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "7px",
                marginBottom: "18px",
                border: "1px solid #d7dcd5",
                borderRadius: "10px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "7px",
                marginBottom: "20px",
                border: "1px solid #d7dcd5",
                borderRadius: "10px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: 0,
              borderRadius: "10px",
              background: "#18251b",
              color: "white",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "18px",
              color: "#59615a",
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        )}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {mode === "signin"
              ? "Create a new account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
