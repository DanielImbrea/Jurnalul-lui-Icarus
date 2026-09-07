import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BuyButton from "@/components/BuyButton";
import ProductPrice from "@/components/ProductPrice";
import { productList } from "@/lib/products";
import { SHIPPING_RON } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Comandă",
  description:
    "Comandă direct cărțile lui Daniel Imbrea — Sub umbrele lui Blake, Îmbrățișarea durerii și avantajele ei, sau pachetul complet. Plată securizată prin card.",
  alternates: { canonical: "/comanda" }
};

export default function ComandaPage() {
  return (
    <>
      <PageHero
        eyebrow="Comandă"
        title="Alege ce vrei să citești."
        description="Comanda se procesează securizat prin Stripe. Primești confirmarea instant, pe email."
        atmosphere="neutral"
      />

      <section className="relative py-24">
        <div className="container-editorial grid gap-8 md:grid-cols-3">
          {productList.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between border border-bone/10 bg-charcoal/40 p-8"
            >
              <div>
                <p className="font-sans text-[12px] text-ember">{product.badge}</p>
                <h2 className="mt-3 font-serif text-2xl leading-snug text-bone">
                  {product.title}
                </h2>
                <p className="mt-2 font-sans text-sm italic text-mist">{product.subtitle}</p>
              </div>

              <div className="mt-10 border-t border-bone/10 pt-6">
                <ProductPrice priceRon={product.priceRon} showTotal />
                <div className="mt-6">
                  <BuyButton productId={product.id} label="Comandă" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="container-editorial mt-16 max-w-2xl border-t border-bone/10 pt-10">
          <h3 className="font-serif text-xl text-bone">Cum funcționează comanda</h3>
          <ol className="mt-5 space-y-4 font-sans text-sm leading-relaxed text-ash">
            <li>
              1. Alegi cartea sau pachetul pe care vrei să îl primești și plasezi
              comanda.
            </li>
            <li>
              2. Alegi <span className="text-mist">plata cu cardul</span> (Stripe)
              sau <span className="text-mist">ramburs la curier</span>. Transportul
              este de {SHIPPING_RON} lei.
            </li>
            <li>
              3. Primești confirmarea comenzii pe email imediat după plasare.
            </li>
            <li>
              4. Comanda este pregătită și expediată în câteva zile lucrătoare.
            </li>
            <li className="text-mist">
              5. După ce citești cartea, mi-ar plăcea să aflu cum ți s-a părut.
              Să-mi spui câteva lucruri despre experiența ta sau, dacă simți,
              chiar câteva lucruri despre tine. Aș fi bucuros să te ascult.
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
