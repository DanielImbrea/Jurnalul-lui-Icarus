import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";
import { legalInfo, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  robots: { index: true, follow: true },
  alternates: { canonical: "/termeni-si-conditii" }
};

export default function TermeniPage() {
  const { operatorName, brandName, siteUrl, contactEmail } = legalInfo;

  return (
    <>
      <PageHero eyebrow="Informații legale" title="Termeni și condiții" atmosphere="neutral" />
      <LegalContent>
        <p className="text-ash">
          Ultima actualizare: {LEGAL_LAST_UPDATED}. Prezentul document reglementează
          utilizarea site-ului {siteUrl} și condițiile de vânzare a produselor
          comercializate prin intermediul acestuia.
        </p>

        <h2>1. Datele operatorului</h2>
        <p>
          Operator: {operatorName} (persoană fizică), în calitate de autor și
          comerciant al produselor disponibile pe site-ul {brandName}.
          <br />
          Website: {siteUrl}
          <br />
          Email de contact:{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            {contactEmail}
          </a>
        </p>

        <h2>2. Obiectul contractului</h2>
        <p>
          Prezentul document reglementează condițiile de vânzare a produselor
          (cărți fizice) comercializate prin acest site, aparținând autorului{" "}
          {operatorName}.
        </p>

        <h2>3. Produse și prețuri</h2>
        <p>
          Prețurile afișate pe site sunt exprimate în lei (RON) și reprezintă
          prețul final al produsului. Costul transportului se adaugă separat,
          conform paginii de checkout și secțiunii{" "}
          <a
            href="/livrare-si-comenzi"
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            Livrare și comenzi
          </a>
          .
        </p>

        <h2>4. Plata</h2>
        <p>
          Plata poate fi efectuată prin card bancar (procesată securizat prin
          Stripe) sau ramburs la curier, la primirea coletului. Site-ul nu
          stochează datele cardului — acestea sunt gestionate integral de
          Stripe, conform standardelor PCI-DSS.
        </p>

        <h2>5. Livrarea</h2>
        <p>
          Detaliile de livrare sunt disponibile în{" "}
          <a
            href="/livrare-si-comenzi"
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            Livrare și comenzi
          </a>
          .
        </p>

        <h2>6. Dreptul de retur</h2>
        <p>
          Consumatorii persoane fizice beneficiază de dreptul de retragere din
          contract, conform legislației aplicabile. Detaliile complete sunt
          disponibile în{" "}
          <a
            href="/politica-de-retur"
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            Politica de retur
          </a>
          .
        </p>

        <h2>7. Proprietate intelectuală</h2>
        <p>
          Conținutul site-ului (texte, design, elemente vizuale) aparține{" "}
          {operatorName} și nu poate fi reprodus, distribuit sau utilizat fără
          acord scris prealabil.
        </p>

        <h2>8. Soluționarea litigiilor</h2>
        <p>
          Prezentul document este guvernat de legislația română. Consumatorii
          pot apela la mecanismele legale de soluționare a litigiilor, inclusiv
          la Autoritatea Națională pentru Protecția Consumatorilor (ANPC) —{" "}
          <a
            href="https://anpc.ro"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            anpc.ro
          </a>
          , și la platforma europeană de soluționare online a litigiilor (SOL) —{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>

        <h2>9. Contact</h2>
        <p>
          Pentru întrebări legate de comenzi, livrări sau drepturile tale ca
          consumator, ne poți scrie la{" "}
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
