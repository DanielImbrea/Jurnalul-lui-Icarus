import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  robots: { index: true, follow: true },
  alternates: { canonical: "/termeni-si-conditii" }
};

export default function TermeniPage() {
  return (
    <>
      <PageHero eyebrow="Informații legale" title="Termeni și condiții" atmosphere="neutral" />
      <LegalContent>
        <p>
          <strong>[COMPLETEAZĂ]</strong> Acest document trebuie redactat sau
          validat de o persoană autorizată (jurist / consultant) înainte de
          lansarea publică a site-ului. Structura de mai jos este un
          punct de plecare, nu conținut juridic final.
        </p>

        <h2>1. Datele operatorului</h2>
        <p>
          Denumire: [COMPLETEAZĂ — persoană fizică autorizată / SRL].
          <br />
          CUI / CIF: [COMPLETEAZĂ].
          <br />
          Sediu / adresă de corespondență: [COMPLETEAZĂ].
          <br />
          Email: [COMPLETEAZĂ].
        </p>

        <h2>2. Obiectul contractului</h2>
        <p>
          Prezentul document reglementează condițiile de vânzare a
          produselor (cărți fizice) comercializate prin acest site,
          aparținând autorului Daniel Imbrea.
        </p>

        <h2>3. Produse și prețuri</h2>
        <p>
          Prețurile afișate pe site sunt exprimate în lei (RON) și includ
          TVA, dacă este cazul. [COMPLETEAZĂ regimul fiscal aplicabil.]
        </p>

        <h2>4. Plata</h2>
        <p>
          Plata se procesează prin Stripe, folosind card bancar. Site-ul
          nu stochează datele cardului — acestea sunt gestionate integral
          de Stripe, conform standardelor PCI-DSS.
        </p>

        <h2>5. Livrarea</h2>
        <p>
          Detaliile de livrare sunt disponibile în{" "}
          <a href="/livrare-si-comenzi" className="underline decoration-bone/30 underline-offset-4 hover:text-ember">
            Livrare și comenzi
          </a>
          .
        </p>

        <h2>6. Dreptul de retur</h2>
        <p>
          Detaliile privind dreptul de retragere din contract sunt
          disponibile în{" "}
          <a href="/politica-de-retur" className="underline decoration-bone/30 underline-offset-4 hover:text-ember">
            Politica de retur
          </a>
          .
        </p>

        <h2>7. Proprietate intelectuală</h2>
        <p>
          Conținutul site-ului (texte, design, elemente vizuale) aparține
          Daniel Imbrea și nu poate fi reprodus fără acord scris.
        </p>

        <h2>8. Legea aplicabilă</h2>
        <p>
          Prezentul document este guvernat de legislația română.
          [COMPLETEAZĂ instanța competentă / procedura de soluționare a
          litigiilor, dacă este necesar.]
        </p>
      </LegalContent>
    </>
  );
}
