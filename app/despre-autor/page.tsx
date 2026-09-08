import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Despre autor",
  description:
    "Daniel Imbrea — autorul cărților Sub Umbrele lui Blake și Îmbrățișarea Durerii și Avantajele ei, și vocea din spatele Jurnalului lui Icarus.",
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
              Am scris despre ce rămâne când oamenii încetează să se mai
              prefacă. Despre iubirile și tentațiile care ne pun în pericol și
              despre durerile care, la un moment dat, se transformă în
              claritate.
            </p>
            <p>
              Am publicat două cărți foarte diferite ca ton, dar legate de
              aceeași întrebare: cât din noi este cel pe care-l arătăm, și
              cât este cel pe care-l ascundem? „Sub Umbrele lui Blake”
              privește această întrebare prin iubire, dorință și risc.
              „Îmbrățișarea Durerii și Avantajele ei” o privește prin
              pierdere, transformare și maturizare.
            </p>
            <p className="text-bone italic">
              Există iubiri care ne salvează. Și există iubiri care ne trag
              încet în întuneric, până când nu mai știm dacă vrem să fim
              salvați sau să ne pierdem cu totul.
            </p>
            <p className="text-bone italic">
              Există dorințe pe care le ascundem atât de bine, încât ajungem
              să credem că nu ne aparțin. Până când apare cineva care le vede.
              Care le atinge. Care știe exact ce să trezească în noi.
            </p>
            <p className="text-bone italic">
              Unele iubiri ne cer să fim vulnerabili. Altele ne cer să ne
              abandonăm limitele. Iar cele mai periculoase ne fac să confundăm
              dorința cu nevoia, atracția cu obsesia și plăcerea cu tot
              ceea ce juram că nu vom deveni niciodată.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="border border-bone/10 bg-charcoal/40 p-8">
              <p className="font-serif text-xl text-bone">Jurnalul lui Icarus</p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ash">
                Un loc în care poveștile nu se termină la ultima pagină.
                Gânduri nerostite, dorințe necontrolate, fragmente, confesiuni
                și conversații despre tot ceea ce se ascunde în noi.
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
