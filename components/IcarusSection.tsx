import Image from "next/image";
import { TIKTOK_URL } from "@/lib/brand";
import { blakeImages } from "@/lib/book-images";
import GoldenSmoke from "./GoldenSmoke";
import ScrollReveal from "./ScrollReveal";

export default function IcarusSection() {
  return (
    <section className="relative py-28">
      <GoldenSmoke wisps={5} subtle />
      <div className="container-editorial">
        <div className="grid gap-12 md:grid-cols-12">
          <ScrollReveal className="md:col-span-7">
            <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
              Comunitatea
            </p>
            <div className="mt-7 max-w-lg space-y-5 font-sans text-base leading-relaxed text-ash">
              <p>
                Jurnalul lui Icarus a început cu scrisul. Jurnalul lui Icarus a început
                prin scris. Prin gânduri, observații și întrebări despre lucrurile pe
                care, de multe ori, alegem să le păstrăm pentru noi.
              </p>
              <p>
                În timp, în jurul acestor texte s-a format o comunitate de cititori care
                au regăsit în ele propriile experiențe, neliniști și întrebări. O parte
                dintre ei au ajuns apoi la cărți, iar dialogul a continuat dincolo de
                pagini.
              </p>
              <p>
                Astăzi, Jurnalul lui Icarus înseamnă mai mult decât cărțile. Înseamnă
                oamenii care le citesc, le interpretează și duc mai departe ceea ce au
                găsit în ele.
              </p>
            </div>

            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-9"
            >
              Descoperă Jurnalul lui Icarus pe TikTok
            </a>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-4 md:col-start-9" delay={120}>
            <div className="overflow-hidden rounded-xl border border-bone/10">
              <div className="relative aspect-[4/5]">
                <Image
                  src={blakeImages[1]}
                  alt="Cititor cu Sub Umbrele lui Blake"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
