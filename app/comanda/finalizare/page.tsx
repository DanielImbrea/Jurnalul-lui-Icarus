import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CheckoutForm from "@/components/cart/CheckoutForm";

export const metadata: Metadata = {
  title: "Finalizare comandă",
  description: "Alege plata cu cardul sau ramburs la curier și finalizează comanda.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/comanda/finalizare" }
};

export default function FinalizarePage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Finalizare comandă"
        description="Alege metoda de plată și completează detaliile de livrare."
        atmosphere="neutral"
        compact
      />

      <section className="relative overflow-x-clip py-16 md:py-24">
        <div className="container-editorial min-w-0">
          <CheckoutForm />
        </div>
      </section>
    </>
  );
}
