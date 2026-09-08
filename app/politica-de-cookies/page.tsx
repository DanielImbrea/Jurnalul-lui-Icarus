import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";
import { legalInfo, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politica de cookies",
  alternates: { canonical: "/politica-de-cookies" }
};

export default function CookiesPage() {
  const { contactEmail } = legalInfo;

  return (
    <>
      <PageHero eyebrow="Informații legale" title="Politica de cookies" atmosphere="neutral" />
      <LegalContent>
        <p className="text-ash">
          Ultima actualizare: {LEGAL_LAST_UPDATED}. Site-ul {legalInfo.brandName}{" "}
          folosește cookie-uri și tehnologii similare. La prima vizită, îți
          solicităm consimțământul pentru cookie-urile care nu sunt strict
          necesare.
        </p>

        <h2>1. Ce sunt cookie-urile</h2>
        <p>
          Cookie-urile sunt fișiere text mici stocate în browserul tău. Ele
          ajută site-ul să funcționeze corect, să-ți amintească preferințele sau,
          cu acordul tău, să înțeleagă cum este folosit site-ul.
        </p>

        <h2>2. Cookie-uri esențiale</h2>
        <p>
          Aceste cookie-uri sunt necesare pentru funcționarea site-ului și nu pot
          fi dezactivate din bannerul de consimțământ:
        </p>
        <ul>
          <li>
            <strong>Stripe</strong> — procesarea securizată a plăților cu
            cardul în checkout;
          </li>
          <li>
            <strong>Preferință consimțământ</strong> — reține alegerea ta
            privind cookie-urile de analiză.
          </li>
        </ul>
        <p>
          Coșul de cumpărături este salvat în{" "}
          <strong>localStorage</strong> (stocare locală în browser), nu prin
          cookie-uri.
        </p>

        <h2>3. Cookie-uri de analiză (Google Analytics)</h2>
        <p>
          Cu consimțământul tău, folosim <strong>Google Analytics</strong> pentru
          a măsura traficul și comportamentul agregat al vizitatorilor (pagini
          vizitate, durata sesiunii, sursa traficului). Google poate seta
          cookie-uri precum <code>_ga</code>, <code>_ga_*</code> și{" "}
          <code>_gid</code>.
        </p>
        <p>
          Aceste cookie-uri sunt activate doar dacă apeși „Accept toate” în
          bannerul de consimțământ. Dacă alegi „Doar esențiale”, Google Analytics
          nu este încărcat.
        </p>
        <p>
          Datele colectate prin Google Analytics sunt procesate de Google LLC,
          conform{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            politicii de confidențialitate Google
          </a>
          .
        </p>

        <h2>4. Cum îți gestionezi preferințele</h2>
        <ul>
          <li>
            la prima vizită, poți alege „Accept toate” sau „Doar esențiale”;
          </li>
          <li>
            poți șterge cookie-urile din setările browserului tău;
          </li>
          <li>
            poți retrage consimțământul ștergând cookie-urile site-ului și
            reîncărcând pagina — bannerul îți va apărea din nou.
          </li>
        </ul>

        <h2>5. Contact</h2>
        <p>
          Pentru întrebări legate de cookie-uri sau prelucrarea datelor, scrie-mi
          la{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            {contactEmail}
          </a>
          .
        </p>
      </LegalContent>
    </>
  );
}
