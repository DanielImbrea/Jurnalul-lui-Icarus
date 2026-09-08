import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";
import { legalInfo, LEGAL_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Livrare și comenzi",
  alternates: { canonical: "/livrare-si-comenzi" }
};

export default function LivrarePage() {
  const {
    shippingZone,
    shippingRon,
    deliveryEstimate,
    couriers,
    contactEmail
  } = legalInfo;

  return (
    <>
      <PageHero eyebrow="Informații utile" title="Livrare și comenzi" atmosphere="neutral" />
      <LegalContent>
        <p className="text-ash">Ultima actualizare: {LEGAL_LAST_UPDATED}.</p>

        <h2>1. Zone de livrare</h2>
        <p>Livrăm în prezent în {shippingZone}.</p>

        <h2>2. Curier și termene</h2>
        <p>
          Comenzile sunt expediate prin {couriers}, în funcție de disponibilitate
          și zonă. Termen estimat de livrare: {deliveryEstimate} de la
          confirmarea comenzii. Termenele pot varia ușor în perioade aglomerate.
        </p>

        <h2>3. Costul livrării</h2>
        <p>
          Costul transportului este de {shippingRon} lei per comandă, indiferent
          de numărul de cărți din coș. Suma finală (produse + transport) este
          afișată înainte de finalizarea comenzii.
        </p>

        <h2>4. Urmărirea comenzii</h2>
        <p>
          După expediere, vei primi pe email numărul de tracking al coletului,
          dacă este disponibil de la curier. Pentru comenzile cu ramburs, vei fi
          contactat telefonic sau prin email în cazul în care sunt necesare
          clarificări privind livrarea.
        </p>

        <h2>5. Confirmarea comenzii</h2>
        <p>
          Comenzile plătite cu cardul sunt confirmate automat după procesarea
          plății prin Stripe. Comenzile cu ramburs sunt înregistrate imediat și
          trec în procesare; plata se face numerar curierului la primirea
          coletului.
        </p>

        <h2>6. Contact</h2>
        <p>
          Pentru întrebări despre comanda ta, scrie-ne la{" "}
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
