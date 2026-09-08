import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BookCard from "@/components/BookCard";
import BundleCTA from "@/components/BundleCTA";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Cărțile",
  description:
    "Sub Umbrele lui Blake și Îmbrățișarea Durerii și Avantajele ei — cele două cărți ale lui Daniel Imbrea.",
  alternates: { canonical: "/carti" }
};

export default function CartiPage() {
  return (
    <>
      <PageHero
        eyebrow="Universul literar"
        title="Două cărți. Două forme ale întunericului."
        compact
        scrollTo={{ href: "#carti", label: "Vezi cărțile" }}
        description={
          <p>
            Una explorează dorința, tentația și misterul iubirii. Cealaltă
            privește durerea — pierdere, transformare și ce rămâne după.
            Amândouă poartă semnătura lui Daniel Imbrea.
          </p>
        }
        atmosphere="blake"
      />

      <section id="carti" className="relative py-16 md:py-20">
        <div className="container-editorial space-y-6">
          <BookCard
            product={products.blake}
            discoverLabel="Descoperă cartea"
            discoverHref="/carti/sub-umbrele-lui-blake"
            variant="showcase"
          />
          <BookCard
            product={products.durere}
            discoverLabel="Descoperă cartea"
            discoverHref="/carti/imbratisarea-durerii-si-avantajele-ei"
            variant="showcase"
          />
        </div>
      </section>

      <BundleCTA />
    </>
  );
}
