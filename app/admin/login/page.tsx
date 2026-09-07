"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Autentificare eșuată.");
        return;
      }

      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Eroare de conexiune.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-bone/10 bg-charcoal/40 p-8"
      >
        <h1 className="font-serif text-2xl text-bone">Admin</h1>
        <p className="mt-2 font-sans text-sm text-ash">Jurnalul lui Icarus</p>

        {error && (
          <p className="mt-6 border border-wine/30 bg-wine/10 px-3 py-2 font-sans text-sm text-bone">
            {error}
          </p>
        )}

        <label className="mt-6 block">
          <span className="font-sans text-[13px] text-ash">Parolă</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-bone/15 bg-ink px-4 py-3 font-sans text-sm text-bone outline-none focus:border-ember/50"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-bone py-3 font-sans text-[13px] text-ink hover:bg-ember disabled:opacity-50"
        >
          {loading ? "..." : "Intră"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
