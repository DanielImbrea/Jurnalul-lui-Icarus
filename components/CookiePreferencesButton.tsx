"use client";

import { resetCookieConsent } from "@/lib/cookie-consent";

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => resetCookieConsent()}
      className="hover:text-bone"
    >
      Preferințe cookie
    </button>
  );
}
