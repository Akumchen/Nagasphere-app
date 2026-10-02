export default function DiagnosticPage() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

  return (
    <main style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1>NagaSphere Diagnostic</h1>
      <p>Supabase URL:</p>
      <code>{process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MISSING"}</code>

      <p style={{ marginTop: 20 }}>Publishable key fingerprint:</p>
      <code>
        {key ? `${key.slice(0, 18)}...${key.slice(-6)}` : "MISSING"}
      </code>
    </main>
  );
}
