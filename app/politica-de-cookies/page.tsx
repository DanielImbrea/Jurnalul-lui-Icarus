import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Politica de cookies",
  alternates: { canonical: "/politica-de-cookies" }
};

export default function CookiesPage() {
  return (
    <>
      <PageHero eyebrow="Informații legale" title="Politica de cookies" atmosphere="neutral" />
      <LegalContent>
        <p>
          <strong>[COMPLETEAZĂ]</strong> Dacă adaugi ulterior instrumente
          de analytics sau marketing (Google Analytics, Meta Pixel, TikTok
          Pixel etc.), acest document trebuie actualizat și trebuie
          implementat un banner de consimțământ cookies conform legii.
        </p>

        <h2>1. Ce sunt cookie-urile</h2>
        <p>
          Fișiere text mici, stocate în browser, care ajută site-ul să
          funcționeze corect și, opțional, să înțeleagă cum este folosit.
        </p>

        <h2>2. Cookie-uri esențiale</h2>
        <p>
          Folosite de Stripe pentru procesarea securizată a plăților.
          Acestea sunt necesare pentru finalizarea comenzii și nu pot fi
          dezactivate.
        </p>

        <h2>3. Cookie-uri de analiză / marketing</h2>
        <p>
          [COMPLETEAZĂ — momentan site-ul nu folosește cookie-uri de
          analiză sau marketing. Dacă vor fi adăugate, vor fi listate
          aici, împreună cu opțiunea de refuz.]
        </p>

        <h2>4. Gestionarea cookie-urilor</h2>
        <p>
          Poți controla și șterge cookie-urile din setările browserului
          tău.
        </p>
      </LegalContent>
    </>
  );
}
