import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CartView from "@/components/cart/CartView";
import { SHIPPING_RON } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Coș",
  description:
    "Coșul tău — Sub Umbrele lui Blake, Îmbrățișarea Durerii și Avantajele ei, sau pachetul complet.",
  alternates: { canonical: "/comanda" }
};

export default function ComandaPage() {
  return (
    <>
      <PageHero
        eyebrow="Coș"
        title="Comanda ta."
        description={`Transport ${SHIPPING_RON} lei · Alege plata cu cardul sau ramburs la finalizare.`}
        atmosphere="neutral"
        compact
      />

      <section className="relative overflow-x-clip py-16 md:py-24">
        <div className="container-editorial min-w-0">
          <CartView />
        </div>
      </section>
    </>
  );
}
