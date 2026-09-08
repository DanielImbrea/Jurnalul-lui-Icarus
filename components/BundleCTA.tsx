import Image from "next/image";
import { products } from "@/lib/products";
import { bundleImages } from "@/lib/book-images";
import AddToCartButton from "./AddToCartButton";
import ProductPrice from "./ProductPrice";
import ScrollReveal from "./ScrollReveal";

export default function BundleCTA() {
  const bundle = products.bundle;

  return (
    <section className="relative border-y border-bone/10 py-24">
      <div className="container-editorial">
        <ScrollReveal>
          <div className="grid items-center gap-10 overflow-hidden rounded-xl border border-bone/10 bg-charcoal/20 md:grid-cols-12">
            <div className="relative aspect-[4/3] md:col-span-5 md:aspect-auto md:min-h-[320px]">
              <Image
                src={bundleImages[0]}
                alt="Ambele cărți — Sub Umbrele lui Blake și Îmbrățișarea Durerii"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>

            <div className="p-8 md:col-span-7 md:p-10">
              <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
                Pachet complet
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-bone sm:text-4xl">
                Citește-le pe amândouă.
              </h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-ash">
                Două cărți. Două forme ale întunericului. Două feluri de a privi
                ceea ce ni se întâmplă.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4">
                <ProductPrice priceRon={bundle.priceRon} showTotal />
                <AddToCartButton
                  productId="bundle"
                  label="Adaugă pachetul în coș"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
