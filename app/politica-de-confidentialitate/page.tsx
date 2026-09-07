import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LegalContent from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  alternates: { canonical: "/politica-de-confidentialitate" }
};

export default function ConfidentialitatePage() {
  return (
    <>
      <PageHero eyebrow="Informații legale" title="Politica de confidențialitate" atmosphere="neutral" />
      <LegalContent>
        <p>
          <strong>[COMPLETEAZĂ]</strong> Acest document trebuie adaptat
          conform GDPR și verificat de o persoană autorizată înainte de
          lansare.
        </p>

        <h2>1. Ce date colectăm</h2>
        <p>
          La plasarea unei comenzi colectăm: nume, adresă de livrare,
          email, telefon și date de facturare. Datele de card sunt
          procesate exclusiv de Stripe și nu ajung pe serverele noastre.
        </p>

        <h2>2. Scopul prelucrării</h2>
        <p>
          Datele sunt folosite pentru procesarea comenzii, livrare,
          facturare și comunicare legată strict de comandă.
        </p>

        <h2>3. Temeiul legal</h2>
        <p>
          Executarea contractului de vânzare-cumpărare și obligațiile
          legale de facturare. [COMPLETEAZĂ dacă se colectează date și în
          scop de marketing, cu consimțământ separat.]
        </p>

        <h2>4. Partajarea datelor</h2>
        <p>
          Datele necesare procesării plății sunt partajate cu Stripe.
          Datele necesare expedierii sunt partajate cu serviciul de
          curierat ales. [COMPLETEAZĂ numele curierului.]
        </p>

        <h2>5. Durata stocării</h2>
        <p>[COMPLETEAZĂ perioada de păstrare a datelor, conform obligațiilor fiscale.]</p>

        <h2>6. Drepturile persoanei vizate</h2>
        <p>
          Ai dreptul de acces, rectificare, ștergere, restricționare și
          portabilitate a datelor tale. Pentru exercitarea acestor
          drepturi, ne poți contacta la [COMPLETEAZĂ email].
        </p>
      </LegalContent>
    </>
  );
}
