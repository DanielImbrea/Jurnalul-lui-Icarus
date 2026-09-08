"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { BookId } from "@/lib/validation";

export default function GalleryUploadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookId, setBookId] = useState<BookId>("blake");
  const [caption, setCaption] = useState("");
  const [consent, setConsent] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyFile = useCallback((file: File | null) => {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
    setImage(file);
  }, []);

  function resetForm(options?: { keepSuccess?: boolean }) {
    setName("");
    setEmail("");
    setBookId("blake");
    setCaption("");
    setConsent(false);
    setError(null);
    if (!options?.keepSuccess) {
      setSuccess(null);
    }
    applyFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyFile(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) applyFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Adaugă o fotografie înainte de a trimite.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bookId", bookId);
    formData.append("caption", caption);
    formData.append("consentGiven", String(consent));
    formData.append("image", image);

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la trimitere.");
        return;
      }

      resetForm({ keepSuccess: true });
      setSuccess(data.message);
    } catch {
      setError("Nu am putut trimite fotografia.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="panel-glass text-center">
        <p className="font-serif text-xl text-bone">{success}</p>
        <p className="mt-3 font-sans text-sm text-ash">Mulțumesc</p>
        <button
          type="button"
          onClick={() => resetForm()}
          className="btn-secondary mt-8 !px-5 !py-2.5 !text-[12px]"
        >
          Trimite altă fotografie
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="panel-glass space-y-6">
      {error && (
        <p className="rounded-xl border border-wine/40 bg-wine/10 px-4 py-3 font-sans text-sm text-bone">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="font-sans text-[13px] text-ash">Nume</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cum te numești"
            className="input-field"
          />
        </label>

        <label className="block">
          <span className="font-sans text-[13px] text-ash">
            Email <span className="text-ash/50">(opțional)</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="pentru confirmare"
            className="input-field"
          />
        </label>
      </div>

      <label className="block">
        <span className="font-sans text-[13px] text-ash">Cartea</span>
        <select
          value={bookId}
          onChange={(e) => setBookId(e.target.value as BookId)}
          className="input-field"
        >
          <option value="blake">Sub Umbrele lui Blake</option>
          <option value="durere">Îmbrățișarea Durerii și Avantajele ei</option>
        </select>
      </label>

      <label className="block">
        <span className="font-sans text-[13px] text-ash">
          Câteva cuvinte <span className="text-ash/50">(opțional)</span>
        </span>
        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Locul, contextul sau o scurtă impresie despre lectură (opțional)"
          className="input-field resize-y"
        />
      </label>

      <div>
        <span className="font-sans text-[13px] text-ash">Fotografia ta</span>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          className={`photo-drop-zone ${dragActive ? "photo-drop-zone-active" : ""}`}
        >
          {preview ? (
            <>
              <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl border border-bone/15">
                <Image
                  src={preview}
                  alt="Previzualizare fotografie"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="font-sans text-sm text-bone">{image?.name}</p>
              <p className="font-sans text-xs text-ash">Apasă pentru a schimba fotografia</p>
            </>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/20 bg-black/30">
                <svg
                  className="h-5 w-5 text-ember"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </span>
              <p className="font-sans text-sm text-bone">Adaugă fotografia</p>
              <p className="max-w-xs font-sans text-xs leading-relaxed text-ash">
                Trage fișierul aici sau apasă pentru a alege din galerie. JPG, PNG sau WebP.
              </p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-bone/10 bg-black/15 p-4">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded accent-ember"
        />
        <span className="font-sans text-sm leading-relaxed text-ash">
          Accept publicarea fotografiei în galeria Cititorii lui Icarus.
        </span>
      </label>

      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? "Se trimite..." : "Trimite-mi"}
      </button>
    </form>
  );
}
