import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Livrare și comenzi",
  alternates: { canonical: "/livrare-si-comenzi" }
};

export default function LivrarePage() {
  return (
    <>
      <PageHero eyebrow="Informații utile" title="Livrare și comenzi" atmosphere="neutral" />
      <LegalContent>
        <h2>1. Zone de livrare</h2>
        <p>Livrăm în prezent în [COMPLETEAZĂ — ex. toată România].</p>

        <h2>2. Curier și termene</h2>
        <p>
          [COMPLETEAZĂ numele curierului folosit] · Termen estimat de
          livrare: [COMPLETEAZĂ, ex. 2-5 zile lucrătoare].
        </p>

        <h2>3. Costul livrării</h2>
        <p>[COMPLETEAZĂ costul de livrare sau pragul pentru livrare gratuită.]</p>

        <h2>4. Urmărirea comenzii</h2>
        <p>
          După expediere, vei primi pe email numărul de tracking al
          coletului. [COMPLETEAZĂ dacă se trimite automat sau manual.]
        </p>

        <h2>5. Confirmarea comenzii</h2>
        <p>
          Confirmarea comenzii se primește automat pe email, imediat după
          finalizarea plății prin Stripe.
        </p>
      </LegalContent>
    </>
  );
}
