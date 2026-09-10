"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import EmojiInsertButton, {
  insertAtTextareaCursor,
} from "@/components/EmojiInsertButton";
import { useToast } from "@/components/ToastProvider";

interface CommunityPostFormProps {
  parentId?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function CommunityPostForm({
  parentId,
  compact = false,
  onSuccess,
}: CommunityPostFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          content,
          parentId: parentId ?? "",
          consentGiven: consent,
          emailConsentGiven: emailConsent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Nu am putut trimite mesajul.");
      }

      setSubmitted(true);
      showToast(data.message || "Mesaj trimis.");
      onSuccess?.();

      if (!parentId) {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted && compact) {
    return (
      <p className="font-sans text-sm text-ember">
        Mulțumesc — mesajul va apărea după moderare.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`panel-glass space-y-5 rounded-2xl border border-bone/10 p-6 sm:p-8 ${
        compact ? "mt-4" : ""
      }`}
    >
      {!compact && (
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
            Scrie aici
          </p>
          <p className="mt-2 font-sans text-sm text-ash">
            Numele tău va apărea public dacă mesajul e aprobat. Emailul e privat
            implicit — poți bifa opțional dacă vrei să apară și el, după ce îl
            aprob eu.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block font-sans text-sm text-mist">
          Nume
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Cum te numești"
          />
        </label>
        <label className="block font-sans text-sm text-mist">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="pentru confirmare (privat)"
          />
        </label>
      </div>

      <label className="block font-sans text-sm text-mist">
        {parentId ? "Răspunsul tău" : "Mesajul tău"}
        <div className="relative mt-1">
          <textarea
            ref={contentRef}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={compact ? 4 : 6}
            className="input-field resize-y pr-12"
            placeholder={
              parentId
                ? "Scrie un răspuns..."
                : "Gânduri, întrebări, confesiuni — ce ai simțit nevoia să spui..."
            }
          />
          <EmojiInsertButton
            className="absolute bottom-3 right-3"
            onInsert={(emoji) =>
              insertAtTextareaCursor(
                contentRef.current,
                content,
                emoji,
                setContent,
              )
            }
          />
        </div>
      </label>

      <label className="flex items-start gap-3 font-sans text-sm text-ash">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-ember"
        />
        <span>
          Accept ca mesajul meu să fie moderat și, dacă este aprobat, publicat
          în comunitate.
        </span>
      </label>

      <label className="flex items-start gap-3 font-sans text-sm text-ash">
        <input
          type="checkbox"
          checked={emailConsent}
          onChange={(e) => setEmailConsent(e.target.checked)}
          className="mt-0.5 size-4 rounded accent-ember"
        />
        <span>
          Accept ca adresa mea de email să fie afișată public, dacă o aprob
          separat (opțional).
        </span>
      </label>

      {error && <p className="font-sans text-sm text-wine-light">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:opacity-50"
      >
        {loading
          ? "Se trimite..."
          : parentId
            ? "Trimite răspunsul"
            : "Trimite mesajul"}
      </button>
    </form>
  );
}
