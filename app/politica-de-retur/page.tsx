import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";
import { legalInfo, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politica de retur",
  alternates: { canonical: "/politica-de-retur" }
};

export default function ReturPage() {
  const { contactEmail } = legalInfo;

  return (
    <>
      <PageHero eyebrow="Informații legale" title="Politica de retur" atmosphere="neutral" />
      <LegalContent>
        <p className="text-ash">
          Ultima actualizare: {LEGAL_LAST_UPDATED}. Conform legislației privind
          protecția consumatorilor, cumpărătorii persoane fizice au dreptul de a
          se retrage dintr-un contract încheiat online, în termen de 14 zile
          calendaristice, fără a fi nevoie de justificare.
        </p>

        <h2>1. Termenul de retragere</h2>
        <p>
          Termenul de 14 zile începe de la data la care tu sau o persoană
          desemnată de tine (alta decât transportatorul) intră în posesia
          fizică a produsului. Produsele comercializate pe acest site sunt cărți
          fizice; dreptul de retragere se aplică în condițiile legii, cu
          respectarea stării produsului returnat.
        </p>

        <h2>2. Cum se face returul</h2>
        <p>
          Pentru a exercita dreptul de retragere, ne contactezi la{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            {contactEmail}
          </a>{" "}
          cu numele, adresa de email, numărul comenzii și produsele pe care dorești
          să le returnezi. Îți vom comunica adresa de retur și pașii următori.
        </p>
        <p>
          Produsul trebuie returnat în ambalajul original, nefolosit, fără urme
          de deteriorare cauzate de manipulare excesivă.
        </p>

        <h2>3. Costurile returului</h2>
        <p>
          Costurile directe ale returnării produsului sunt suportate de
          cumpărător, exceptând cazurile în care produsul este defect sau a fost
          livrat greșit.
        </p>

        <h2>4. Rambursarea</h2>
        <p>
          Rambursarea contravalorii produsului se face în maximum 14 zile de la
          primirea produsului returnat sau de la primirea dovezii că l-ai
          expediat, prin aceeași metodă de plată folosită la comandă (card sau
          transfer bancar, după caz). Suma returnată nu include costul
          transportului inițial, exceptând cazurile prevăzute de lege.
        </p>

        <h2>5. Produse deteriorate la livrare</h2>
        <p>
          Dacă produsul ajunge deteriorat sau coletul prezintă urme vizibile de
          avarie, te rugăm să ne contactezi imediat, cu fotografii ale coletului
          și ale produsului, la{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            {contactEmail}
          </a>
          . Vom găsi împreună cea mai potrivită soluție: înlocuire sau
          rambursare.
        </p>
      </LegalContent>
    </>
  );
}
