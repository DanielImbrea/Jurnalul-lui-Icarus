import Link from "next/link";
import Image from "next/image";
import BookCard from "./BookCard";
import ScrollReveal from "./ScrollReveal";
import GoldenSmoke from "./GoldenSmoke";
import { blakeFeaturedImages } from "@/lib/book-images";
import { products } from "@/lib/products";

export default function BookShowcase() {
  return (
    <section className="relative border-y border-bone/10 py-20 md:py-24">
      <GoldenSmoke wisps={6} subtle />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(90,30,42,0.12),transparent_70%)]"
        aria-hidden
      />

      <div className="container-editorial relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <ScrollReveal className="lg:col-span-5">
            <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-ember">
              Universul literar
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight text-bone sm:text-5xl">
              Două cărți.
              <br />
              <span className="italic text-mist">Două lumi.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={80}>
            <p className="max-w-lg font-sans text-base leading-relaxed text-ash lg:ml-auto lg:text-right">
              Nu sunt continuarea una a celeilalte. Sunt două fețe ale aceluiași
              univers — una scrisă din dorință, cealaltă din durere.
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-12 space-y-5 md:mt-14">
          <ScrollReveal delay={120}>
            <BookCard
              product={products.blake}
              discoverLabel="Descoperă cartea"
              discoverHref="/carti/sub-umbrele-lui-blake"
              variant="showcase"
            />
          </ScrollReveal>
          <ScrollReveal delay={180}>
            <BookCard
              product={products.durere}
              discoverLabel="Descoperă cartea"
              discoverHref="/carti/imbratisarea-durerii-si-avantajele-ei"
              variant="showcase"
            />
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-14 md:mt-16" delay={220}>
          <Link
            href="/carti/sub-umbrele-lui-blake"
            className="group grid overflow-hidden rounded-2xl border border-bone/10 bg-charcoal/20 md:grid-cols-[1.05fr_1fr] md:items-stretch"
          >
            <div className="relative aspect-[3/4] bg-gradient-to-b from-charcoal/80 to-black/90 md:aspect-auto md:min-h-[480px]">
              <Image
                src={blakeFeaturedImages.moment}
                alt="Sub Umbrele lui Blake — atmosferă"
                fill
                className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02] md:p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ember">
                Sub Umbrele lui Blake
              </p>
              <p className="mt-4 font-serif text-2xl leading-snug text-bone md:text-3xl">
                Nu toate dorințele ar trebui urmate.
              </p>
              <p className="mt-4 font-sans text-sm leading-relaxed text-ash">
                Dar unele sunt imposibil de ignorat.
              </p>
              <span className="mt-6 inline-block font-sans text-[12px] text-bone underline decoration-bone/30 underline-offset-4 transition-colors group-hover:text-ember group-hover:decoration-ember">
                Descoperă cartea →
              </span>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
