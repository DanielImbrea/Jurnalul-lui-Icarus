"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsent
} from "@/lib/cookie-consent";

export default function CookieConsentBanner() {
  const [consent, setConsent] = useState<CookieConsent | null | undefined>(
    undefined
  );

  useEffect(() => {
    function syncConsent() {
      setConsent(readCookieConsent());
    }

    syncConsent();
    window.addEventListener(CONSENT_EVENT, syncConsent);
    return () => window.removeEventListener(CONSENT_EVENT, syncConsent);
  }, []);

  if (consent !== null) return null;

  function accept(analytics: boolean) {
    setConsent(writeCookieConsent(analytics));
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] p-2 sm:p-4"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="pointer-events-auto relative mx-auto max-w-3xl overflow-hidden rounded-xl border border-wine/30 bg-gradient-to-br from-[#5A1E2A]/55 via-[#2d0a14]/70 to-[#0E0D0C]/85 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(90,30,42,0.35),transparent_55%)]"
        />

        <div className="relative">
          <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-ember">
            Confidențialitate
          </p>
          <h2
            id="cookie-consent-title"
            className="mt-1 font-serif text-base text-bone sm:mt-1.5 sm:text-xl"
          >
            Cookie-uri și date de utilizare
          </h2>
          <p
            id="cookie-consent-desc"
            className="mt-1.5 font-sans text-[12px] leading-snug text-bone sm:mt-2 sm:text-[13px]"
          >
            Folosim cookie-uri esențiale pentru funcționarea comenzilor și, cu
            acordul tău, Google Analytics pentru a înțelege cum este folosit
            site-ul. Poți alege ce accepți oricând din{" "}
            <Link
              href="/politica-de-cookies"
              className="text-bone underline decoration-wine-light/40 underline-offset-4 transition-colors hover:text-ember"
            >
              politica de cookies
            </Link>
            .
          </p>

          <div className="mt-2.5 flex flex-row flex-nowrap items-center gap-2 sm:mt-4 sm:flex-wrap">
            <button
              type="button"
              onClick={() => accept(true)}
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-lg border border-wine-light/40 bg-wine/75 px-2 py-1.5 font-sans text-[10px] tracking-wide text-bone shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-ember/50 hover:bg-wine-light/80 hover:text-bone sm:flex-none sm:px-5 sm:py-2 sm:text-[11px]"
            >
              Accept toate
            </button>
            <button
              type="button"
              onClick={() => accept(false)}
              className="inline-flex min-w-0 flex-1 items-center justify-center rounded-lg border border-bone/20 bg-black/25 px-2 py-1.5 font-sans text-[10px] tracking-wide text-bone backdrop-blur-sm transition-all duration-300 hover:border-wine-light/45 hover:bg-wine/20 hover:text-bone sm:flex-none sm:px-5 sm:py-2 sm:text-[11px]"
            >
              Doar esențiale
            </button>
            <Link
              href="/politica-de-cookies"
              className="hidden shrink-0 px-1 font-sans text-[11px] text-ash underline decoration-bone/20 underline-offset-4 transition-colors hover:text-ember sm:inline sm:px-2 sm:py-2 sm:ml-auto"
            >
              Detalii
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
