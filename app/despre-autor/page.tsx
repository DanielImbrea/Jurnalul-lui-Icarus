import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Despre autor",
  description:
    "Daniel Imbrea — autorul cărților Sub umbrele lui Blake și Îmbrățișarea durerii și avantajele ei, și vocea din spatele Jurnalului lui Icarus.",
  alternates: { canonical: "/despre-autor" }
};

export default function DespreAutorPage() {
  return (
    <>
      <PageHero
        eyebrow="Autorul"
        title="Daniel Imbrea"
        description="Unele povești pornesc din imaginație. Altele pornesc din lucrurile pe care nu am știut niciodată cum să le spunem."
        atmosphere="durere"
      />

      <section className="relative py-24">
        <div className="container-editorial grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7 space-y-6 font-sans text-[16px] leading-relaxed text-mist">
            <p>
              Daniel Imbrea scrie despre ce rămâne când oamenii încetează
              să se mai prefacă. Despre iubirile care ne pun în pericol și
              despre durerile care, la un moment dat, se transformă în
              claritate.
            </p>
            <p>
              A publicat două cărți foarte diferite ca ton, dar legate de
              aceeași întrebare: cât din noi este cel pe care-l arătăm, și
              cât este cel pe care-l ascundem? „Sub umbrele lui Blake”
              privește această întrebare prin iubire, dorință și risc.
              „Îmbrățișarea durerii și avantajele ei” o privește prin
              pierdere, transformare și maturizare.
            </p>
            <p>
              Înainte de acest site, cărțile lui ajunseseră deja la peste
              200 de cititori — mulți dintre ei descoperiți prin Jurnalul
              lui Icarus, spațiul în care Daniel scrie de multă vreme cu
              voce tare despre lucrurile pe care majoritatea le țin în
              tăcere.
            </p>
            <p className="text-bone italic">
              Există iubiri care ne salvează. Și există iubiri care ne
              obligă să ne privim în oglindă.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="border border-bone/10 bg-charcoal/40 p-8">
              <p className="font-serif text-xl text-bone">Jurnalul lui Icarus</p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ash">
                Comunitatea din jurul cărților lui Daniel — gânduri,
                fragmente și conversații care continuă dincolo de pagină.
              </p>
              <Link
                href="/jurnalul-lui-icarus"
                className="mt-6 inline-block font-sans text-[13px] text-bone underline decoration-bone/30 underline-offset-4 hover:text-ember hover:decoration-ember"
              >
                Descoperă comunitatea
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
