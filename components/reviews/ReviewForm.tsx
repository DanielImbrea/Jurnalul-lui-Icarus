"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "./StarRating";
import type { BookId } from "@/lib/validation";

interface ReviewFormProps {
  defaultBookId?: BookId;
  compact?: boolean;
}

export default function ReviewForm({
  defaultBookId,
  compact = false
}: ReviewFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookId, setBookId] = useState<BookId>(defaultBookId ?? "blake");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [consent, setConsent] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bookId", bookId);
    formData.append("rating", String(rating));
    formData.append("content", content);
    formData.append("socialHandle", socialHandle);
    formData.append("consentGiven", String(consent));
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/reviews", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la trimitere.");
        return;
      }

      setSuccess(data.message);
      setName("");
      setEmail("");
      setContent("");
      setSocialHandle("");
      setConsent(false);
      setImage(null);
      setRating(5);
    } catch {
      setError("Nu am putut trimite recenzia. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="panel-glass rounded-2xl border border-bone/10 p-10 text-center">
        <p className="font-serif text-2xl text-bone">{success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="panel-glass space-y-8 sm:p-10">
      {!compact && (
        <div>
          <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
            Cititorii lui Icarus
          </p>
          <h2 className="mt-3 font-serif text-3xl text-bone">Spune-ne ce a rămas cu tine.</h2>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-wine/40 bg-wine/10 px-4 py-3 font-sans text-sm text-bone">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-ash">Nume</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
        </label>

        <label className="block">
          <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-ash">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </label>
      </div>

      {!defaultBookId && (
        <label className="block">
          <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-ash">Cartea</span>
          <select
            value={bookId}
            onChange={(e) => setBookId(e.target.value as BookId)}
            className="select-field"
          >
            <option value="blake">Sub umbrele lui Blake</option>
            <option value="durere">Îmbrățișarea durerii și avantajele ei</option>
          </select>
        </label>
      )}

      <div>
        <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-ash">
          Nota ta
        </span>
        <p className="mt-1 font-sans text-[12px] text-ash/70">
          Cât de mult ți-a rămas cartea?
        </p>
        <div className="mt-3">
          <StarRating
            rating={rating}
            interactive
            value={rating}
            onChange={setRating}
            ariaLabel={`Nota: ${rating} din 5 stele`}
          />
        </div>
      </div>

      <label className="block">
        <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-ash">Recenzia ta</span>
        <textarea
          required
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ce a rămas cu tine după ce ai închis cartea?"
          className="input-field resize-y leading-relaxed"
        />
      </label>

      <label className="block">
        <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-ash">
          TikTok / Instagram <span className="normal-case tracking-normal text-ash/50">(opțional)</span>
        </span>
        <input
          value={socialHandle}
          onChange={(e) => setSocialHandle(e.target.value)}
          placeholder="@username"
          className="input-field"
        />
      </label>

      <label className="block">
        <span className="font-sans text-[12px] uppercase tracking-[0.08em] text-ash">
          Fotografie <span className="normal-case tracking-normal text-ash/50">(opțional)</span>
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="input-field cursor-pointer file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-charcoal/80 file:px-4 file:py-2 file:font-sans file:text-[12px] file:uppercase file:tracking-wide file:text-bone file:transition-colors hover:file:bg-charcoal"
        />
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-bone/10 bg-black/15 px-4 py-4">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded accent-ember"
        />
        <span className="font-sans text-sm leading-relaxed text-ash">
          Accept publicarea recenziei mele și a fotografiei, dacă am încărcat una,
          pe website-ul Jurnalul lui Icarus.
        </span>
      </label>

      {!compact && (
        <p className="rounded-xl border border-bone/10 bg-black/15 px-4 py-3.5 font-sans text-[13px] leading-relaxed text-ash">
          Recenziile aprobate apar pe pagina fiecărei cărți, în secțiunea{" "}
          <span className="text-mist">Cititorii lui Icarus</span> de pe homepage
          și, uneori, ca recenzie reprezentativă acolo.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Se trimite..." : "Trimite recenzia"}
      </button>

      {!compact && (
        <p className="font-sans text-sm text-ash">
          Vrei doar să îmi trimiți o fotografie?{" "}
          <Link href="/galeria-cititorilor#trimite" className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-ember">
            Galeria cititorilor
          </Link>
        </p>
      )}
    </form>
  );
}
