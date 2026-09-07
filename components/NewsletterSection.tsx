"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare.");
        return;
      }

      setMessage(data.message);
      setEmail("");
    } catch {
      setError("Nu am putut procesa abonarea.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative border-t border-bone/10 py-20">
      <div className="container-editorial">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-serif text-2xl text-bone sm:text-3xl">
            Un loc pentru gândurile care nu își găsesc întotdeauna locul în altă parte
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ash">
            Fragmente, gânduri și noutăți din universul lui Icarus.
          </p>

          {message ? (
            <p className="mt-8 font-sans text-sm text-ember">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.ro"
                className="input-field mt-0 flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="border border-bone/30 px-6 py-3 font-sans text-[13px] text-bone transition-colors hover:border-ember hover:text-ember disabled:opacity-50"
              >
                {loading ? "..." : "Rămâi aproape"}
              </button>
            </form>
          )}

          {error && (
            <p className="mt-4 font-sans text-sm text-wine-light">{error}</p>
          )}
        </div>
      </div>
    </section>
  );
}
