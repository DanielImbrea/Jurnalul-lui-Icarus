import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import BuyButton from "@/components/BuyButton";
import ProductPrice from "@/components/ProductPrice";
import JsonLd from "@/components/JsonLd";
import BookGallery from "@/components/BookGallery";
import BookReviewsSection from "@/components/reviews/BookReviewsSection";
import ReviewCTA from "@/components/reviews/ReviewCTA";
import { durereImages, getBookCover } from "@/lib/book-images";
import { products } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";

const product = products.durere;

export const metadata: Metadata = {
  title: `${product.title} — ${product.subtitle}`,
  description:
    "Îmbrățișarea durerii și avantajele ei, de Daniel Imbrea (2023) — despre durere, transformare și echilibrul dintre lacrimi și succes.",
  alternates: { canonical: `/carti/${product.slug}` },
  openGraph: {
    title: product.title,
    description: product.subtitle,
    images: [{ url: absoluteUrl(getBookCover("durere")), width: 1200, height: 630 }]
  }
};

export default function DurerePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: product.title,
          alternateName: product.subtitle,
          author: { "@type": "Person", name: product.meta.author },
          ...(product.meta.publisher
            ? { publisher: { "@type": "Organization", name: product.meta.publisher } }
            : {}),
          datePublished: String(product.meta.year),
          inLanguage: "ro",
          offers: {
            "@type": "Offer",
            priceCurrency: "RON",
            price: product.priceRon,
            availability: "https://schema.org/InStock"
          }
        }}
      />

      <PageHero
        eyebrow={product.badge}
        title={product.title}
        description={product.subtitle}
        atmosphere="durere"
      />

      <section className="relative py-24">
        <div className="container-editorial grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="space-y-6 font-sans text-[16px] leading-relaxed text-mist">
              <p>
                Există perioade în viață în care nu pierdem doar oameni, lucruri
                sau drumuri. Pierdem și felul în care credeam că va arăta viața
                noastră. Uneori vine un eșec. Alteori, o despărțire, o
                dezamăgire sau o tăcere pe care nu am ales-o. Iar când toate
                acestea se așază, rămânem singuri cu ceea ce nu mai poate fi
                schimbat.
              </p>
              <p>
                Și atunci apare întrebarea: ce facem cu durerea după ce nu mai
                putem fugi de ea?
              </p>
              <p>
                „Îmbrățișarea durerii și avantajele ei” nu este un manual de
                dezvoltare personală și nu promite că orice suferință ascunde o
                lecție frumoasă. Este o privire sinceră asupra durerii, asupra
                pierderilor care ne schimbă și asupra felului în care putem merge
                mai departe fără să ne prefacem că nu ne-a durut.
              </p>
              <p>
                Pentru că uneori, ceea ce ne frânge este și ceea ce ne obligă să
                ne privim altfel.
              </p>
              <p>
                Durerea ne poate arăta ce contează. Ne poate pune în fața
                propriilor limite, a alegerilor pe care le-am făcut și a celor
                pe care nu am avut curajul să le facem. Iar uneori, tocmai în
                perioada în care simțim că avem cel mai puțin, descoperim în noi
                resurse pe care nu am fi avut niciodată motive să le căutăm.
              </p>
              <p className="italic text-bone">
                Durerea nu este întotdeauna un adversar. Uneori este profesorul
                pe care nu l-am fi ales, dar de la care avem cel mai mult de
                învățat.
              </p>
              <p>
                Cartea urmărește granița fragilă dintre lacrimi și succes — două
                realități care par opuse, dar care, în viața multora dintre noi,
                ajung să se întâlnească. Între ceea ce pierdem și ceea ce
                construim. Între omul care am fost și cel care devenim după ce
                viața ne obligă să o luăm de la capăt.
              </p>
              <p>Nu este o carte despre a scăpa de durere.</p>
              <p>
                Este despre a o înțelege, a o accepta și, poate, a descoperi că
                în locurile în care am crezut că s-a terminat ceva poate începe,
                în timp, o altă versiune a noastră.
              </p>
            </div>

            <div className="mt-14 border-t border-bone/10 pt-8">
              <p className="font-sans text-[13px] text-ash">
                Publicată în {product.meta.year}
              </p>
            </div>
            <BookGallery images={durereImages} title={product.title} />
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="sticky top-28 overflow-hidden rounded-xl border border-bone/10 bg-charcoal/40">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={getBookCover("durere")}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="360px"
                  priority
                />
              </div>
              <div className="p-8">
                <ProductPrice priceRon={product.priceRon} showTotal />
                <p className="mt-3 font-sans text-xs text-ash/80">
                  Plată securizată prin Stripe. Transportul se adaugă la checkout.
                </p>
                <div className="mt-6">
                  <BuyButton productId="durere" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BookReviewsSection bookId="durere" />
      <ReviewCTA bookId="durere" />
    </>
  );
}
