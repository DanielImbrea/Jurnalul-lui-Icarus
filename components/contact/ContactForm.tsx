"use client";

import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { TOPIC_LABELS } from "@/lib/contact-email";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/validation";

export default function ContactForm() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactTopic>("contact");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
          consentGiven: consent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Nu am putut trimite mesajul.");
      }

      setSubmitted(true);
      showToast(data.message || "Mesaj trimis.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="panel-glass rounded-2xl border border-bone/10 p-8 text-center sm:p-10">
        <p className="font-serif text-2xl text-bone">Mulțumesc.</p>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-ash">
          Am primit mesajul tău. Îți răspund pe email cât de curând pot.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel-glass space-y-5 rounded-2xl border border-bone/10 p-6 sm:p-8"
    >
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
          Formular
        </p>
        <p className="mt-2 font-serif text-xl text-bone sm:text-2xl">
          Îmi poți scrie direct aici
        </p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ash">
          Pentru întrebări, feedback despre site sau o problemă tehnică. Mesajul
          ajunge la mine pe email — nu este public.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="font-sans text-[12px] uppercase tracking-[0.08em] text-ash">
          Tip mesaj
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {CONTACT_TOPICS.map((value) => (
            <label
              key={value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                topic === value
                  ? "border-ember/40 bg-ember/5"
                  : "border-bone/10 bg-black/15 hover:border-bone/20"
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={value}
                checked={topic === value}
                onChange={() => setTopic(value)}
                className="mt-0.5 size-4 shrink-0 accent-ember"
              />
              <span className="font-sans text-sm leading-snug text-mist">
                {TOPIC_LABELS[value]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block font-sans text-sm text-mist">
          Nume
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Cum te numești"
            autoComplete="name"
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
            placeholder="Email"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="block font-sans text-sm text-mist">
        Mesajul tău
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field resize-y leading-relaxed"
          placeholder={
            topic === "problem"
              ? "Descrie ce nu merge: pagină, telefon, browser, mesaj de eroare..."
              : topic === "feedback"
                ? "Ce ți-ar plăcea să fie diferit sau mai clar pe site?"
                : "Întrebări despre cărți, comenzi, colaborări..."
          }
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
          Sunt de acord ca numele, emailul și mesajul meu să fie folosite doar
          pentru a răspunde solicitării, conform{" "}
          <Link
            href="/politica-de-confidentialitate"
            className="text-bone underline decoration-bone/30 underline-offset-2 hover:text-ember"
          >
            politicii de confidențialitate
          </Link>
          .
        </span>
      </label>

      {error && <p className="font-sans text-sm text-wine-light">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:opacity-50"
      >
        {loading ? "Se trimite..." : "Trimite mesajul"}
      </button>
    </form>
  );
}
