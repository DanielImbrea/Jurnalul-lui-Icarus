import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { blakeImages } from "@/lib/book-images";

export default function AuthorSection() {
  return (
    <section className="relative overflow-hidden border-b border-bone/10 py-28">
      <div className="wine-gradient-base absolute inset-0 opacity-90" />
      <div className="wine-gradient-glow absolute inset-0 opacity-80" />

      <div className="container-editorial relative z-10 grid gap-12 md:grid-cols-12 md:items-center">
        <ScrollReveal className="md:col-span-5">
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-bone/10 shadow-xl shadow-black/40">
            <Image
              src={blakeImages[4]}
              alt="Daniel Imbrea — universul literar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>
        </ScrollReveal>

        <ScrollReveal className="md:col-span-6 md:col-start-7" delay={100}>
          <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
            Autorul
          </p>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-tight text-bone sm:text-5xl">
            Daniel Imbrea
          </h2>
          <p className="mt-7 max-w-md font-sans text-base leading-relaxed text-mist">
            Unele povești pornesc din imaginație. Altele pornesc din lucrurile pe
            care nu am știut niciodată cum să le spunem.
          </p>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-ash">
            Daniel scrie despre ce se întâmplă atunci când oamenii încetează să se
            mai prefacă — în iubire, în durere, în tăcerile dintre ele. În jurul
            cărților lui s-a format deja o comunitate: Jurnalul lui Icarus.
          </p>

          <Link href="/jurnalul-lui-icarus" className="btn-secondary mt-9">
            Descoperă Jurnalul lui Icarus
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
