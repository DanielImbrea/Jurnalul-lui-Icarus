import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Politica de retur",
  alternates: { canonical: "/politica-de-retur" }
};

export default function ReturPage() {
  return (
    <>
      <PageHero eyebrow="Informații legale" title="Politica de retur" atmosphere="neutral" />
      <LegalContent>
        <p>
          <strong>[COMPLETEAZĂ]</strong> Conform legislației privind
          protecția consumatorilor, cumpărătorii persoane fizice au
          dreptul de a se retrage dintr-un contract încheiat online, în
          termen de 14 zile calendaristice, fără a fi nevoie de
          justificare.
        </p>

        <h2>1. Termenul de retragere</h2>
        <p>
          14 zile de la data primirii produsului. [COMPLETEAZĂ dacă există
          excepții aplicabile — de exemplu pentru produse digitale
          desigilate.]
        </p>

        <h2>2. Cum se face returul</h2>
        <p>
          Ne contactezi la [COMPLETEAZĂ email] cu numărul comenzii. Îți
          vom comunica adresa de retur și pașii următori.
        </p>

        <h2>3. Costurile returului</h2>
        <p>[COMPLETEAZĂ cine suportă costurile de expediere pentru retur.]</p>

        <h2>4. Rambursarea</h2>
        <p>
          Rambursarea se face în maximum 14 zile de la primirea
          produsului returnat, prin aceeași metodă de plată folosită la
          comandă.
        </p>

        <h2>5. Produse deteriorate la livrare</h2>
        <p>
          Dacă produsul ajunge deteriorat, te rugăm să ne contactezi
          imediat, cu fotografii ale coletului, la [COMPLETEAZĂ email].
        </p>
      </LegalContent>
    </>
  );
}
