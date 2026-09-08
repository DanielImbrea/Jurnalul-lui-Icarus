import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import AddToCartButton from "@/components/AddToCartButton";
import ProductPrice from "@/components/ProductPrice";
import JsonLd from "@/components/JsonLd";
import BookGallery from "@/components/BookGallery";
import BookReviewsSection from "@/components/reviews/BookReviewsSection";
import ReviewCTA from "@/components/reviews/ReviewCTA";
import { blakeImages, getBookCover } from "@/lib/book-images";
import { products } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";

const product = products.blake;

export const metadata: Metadata = {
  title: `${product.title} — ${product.subtitle}`,
  description:
    "Sub Umbrele lui Blake, de Daniel Imbrea (Sedcom Libris, 2024) — o poveste dark romance despre iubire, tentație și limitele pe care le încălcăm ca să ne găsim liniștea.",
  alternates: { canonical: `/carti/${product.slug}` },
  openGraph: {
    title: product.title,
    description: product.subtitle,
    images: [{ url: absoluteUrl(getBookCover("blake")), width: 1200, height: 630 }]
  }
};

export default function BlakePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: product.title,
          alternateName: product.subtitle,
          author: { "@type": "Person", name: product.meta.author },
          publisher: product.meta.publisher,
          datePublished: String(product.meta.year),
          numberOfPages: product.meta.pages,
          isbn: product.meta.isbn,
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
        atmosphere="blake"
      />

      <section className="relative overflow-x-clip py-24">
        <div className="container-editorial grid min-w-0 gap-16 md:grid-cols-12">
          <div className="min-w-0 md:col-span-7">
            <div className="space-y-6 break-words font-sans text-[16px] leading-relaxed text-mist">
              <p>
                Există o liniște pe care unii oameni n-o găsesc niciodată în
                lucrurile sigure. O caută în altă parte — în risc, în
                adrenalină, în priviri pe care n-ar trebui să le mai
                întoarcă.
              </p>
              <p>
                „Sub Umbrele lui Blake” este povestea acelei căutări. A unui
                bărbat care și-a construit viața din control și viteză, și a
                unei femei care devine, fără să vrea, singurul lui loc de
                refugiu. Este o poveste despre dorință și despre prețul ei —
                despre cât de aproape pot sta, uneori, pericolul și
                siguranța.
              </p>
              <p>
                Nu este o poveste de dragoste ușoară. Este despre alegerile
                pe care le facem când nu mai putem juca rolul celui care are
                totul sub control. Despre trecutul pe care încercăm să-l
                ținem departe și despre felul în care el revine mereu,
                exact atunci când credem că am scăpat.
              </p>
              <p className="italic text-bone">
                În adâncul fiecărui bărbat se ascunde o căutare tăcută a
                liniștii — iar în momentele întunecate, o găsește fie în
                sufletul curat al cuiva, fie în adrenalină.
              </p>
              <p>
                Este o carte matură, despre tensiune, alegeri și
                consecințe — construită mai degrabă din psihologia
                personajelor decât din scene. Recomandată cititorilor 18+.
              </p>
            </div>

            <div className="mt-14 border-t border-bone/10 pt-8">
              <p className="font-sans text-[13px] text-ash">
                Editura {product.meta.publisher} · {product.meta.year} ·{" "}
                {product.meta.pages} pagini · ISBN {product.meta.isbn}
              </p>
            </div>
            <BookGallery images={blakeImages} title={product.title} />
          </div>

          <aside className="min-w-0 md:col-span-4 md:col-start-9">
            <div className="sticky top-28 overflow-hidden rounded-xl border border-bone/10 bg-charcoal/40">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={getBookCover("blake")}
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
                  Adaugă în coș și alege plata cu cardul sau ramburs la finalizare.
                </p>
                <div className="mt-6">
                  <AddToCartButton productId="blake" label="Adaugă în coș" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BookReviewsSection bookId="blake" />
      <ReviewCTA bookId="blake" />
    </>
  );
}
