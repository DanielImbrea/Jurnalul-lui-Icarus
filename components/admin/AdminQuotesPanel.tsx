"use client";

import { useEffect, useState } from "react";
import { products } from "@/lib/products";

interface Quote {
  id: string;
  bookId?: string | null;
  content: string;
  source?: string | null;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  sortOrder: number;
}

export default function AdminQuotesPanel() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [content, setContent] = useState("");
  const [bookId, setBookId] = useState<string>("");
  const [source, setSource] = useState("");

  async function load() {
    const res = await fetch("/api/admin/quotes");
    setQuotes(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createQuote(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        bookId: bookId || null,
        source: source || null,
        status: "PUBLISHED"
      })
    });
    setContent("");
    setSource("");
    setBookId("");
    await load();
  }

  async function updateQuote(id: string, data: Partial<Quote>) {
    await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    await load();
  }

  async function deleteQuote(id: string) {
    if (!confirm("Ștergi citatul?")) return;
    await fetch(`/api/admin/quotes/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <form onSubmit={createQuote} className="border border-bone/10 bg-charcoal/30 p-6 space-y-4">
        <h2 className="font-serif text-xl text-bone">Adaugă citat</h2>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Citat din carte..."
          className="w-full border border-bone/15 bg-ink px-4 py-3 font-sans text-sm text-bone"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="border border-bone/15 bg-ink px-4 py-3 font-sans text-sm text-bone"
          >
            <option value="">General</option>
            <option value="blake">Sub Umbrele lui Blake</option>
            <option value="durere">Îmbrățișarea Durerii</option>
          </select>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Sursă (opțional)"
            className="border border-bone/15 bg-ink px-4 py-3 font-sans text-sm text-bone"
          />
        </div>
        <button type="submit" className="bg-bone px-6 py-2 font-sans text-[12px] text-ink">
          Adaugă
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {quotes.map((quote) => {
          const book = quote.bookId
            ? products[quote.bookId as keyof typeof products]
            : null;

          return (
            <article
              key={quote.id}
              className="border border-bone/10 bg-charcoal/20 p-5"
            >
              <p className="font-serif text-lg text-bone">„{quote.content}”</p>
              <p className="mt-2 font-sans text-[12px] text-ash">
                {book?.title ?? "General"} · {quote.status}
                {quote.featured && " · FEATURED"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateQuote(quote.id, {
                      status: quote.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED"
                    })
                  }
                  className="border border-bone/20 px-2 py-1 font-sans text-[10px] text-bone"
                >
                  {quote.status === "PUBLISHED" ? "Hide" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateQuote(quote.id, { featured: !quote.featured })
                  }
                  className="border border-bone/20 px-2 py-1 font-sans text-[10px] text-ember"
                >
                  {quote.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteQuote(quote.id)}
                  className="border border-wine/30 px-2 py-1 font-sans text-[10px] text-wine-light"
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
