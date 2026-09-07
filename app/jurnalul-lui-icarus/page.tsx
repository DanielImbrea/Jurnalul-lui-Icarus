import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/brand";
import { blakeImages } from "@/lib/book-images";

export const metadata: Metadata = {
  title: "Jurnalul lui Icarus",
  description:
    "Jurnalul lui Icarus — comunitatea din jurul cărților lui Daniel Imbrea. Gânduri, fragmente și conversații care continuă dincolo de pagină.",
  alternates: { canonical: "/jurnalul-lui-icarus" }
};

export default function IcarusPage() {
  return (
    <>
      <PageHero
        eyebrow="Comunitatea"
        title="Jurnalul lui Icarus"
        description="Dacă ai ajuns aici, probabil ai întâlnit deja Icarus."
        atmosphere="blake"
      />

      <section className="relative py-24">
        <div className="container-editorial grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7 space-y-6 font-sans text-[16px] leading-relaxed text-mist">
            <p>
              Jurnalul lui Icarus a pornit ca un loc în care Daniel a scris
              cu voce tare — gânduri neterminate, întrebări incomode,
              fragmente de poveste care aveau să devină, mai târziu, cărți.
            </p>
            <p>
              Astăzi este mai mult decât un jurnal. Este comunitatea din
              jurul universului lui Daniel Imbrea — oamenii care au citit
              primii, care au recunoscut ceva din ei în „Sub umbrele lui
              Blake” sau în „Îmbrățișarea durerii”, și care continuă
              conversația în fiecare zi.
            </p>
            <p className="text-bone">
              Cărțile sunt universul literar. Icarus este comunitatea.
              Daniel Imbrea este vocea care le leagă pe amândouă.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col overflow-hidden rounded-xl border border-bone/10 bg-charcoal/40 transition-colors hover:border-bone/20"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={blakeImages[1]}
                  alt="Comunitatea Jurnalul lui Icarus"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-ember">
                    TikTok
                  </p>
                  <p className="mt-2 font-serif text-2xl text-bone">{TIKTOK_HANDLE}</p>
                  <p className="mt-2 font-sans text-[13px] leading-relaxed text-mist">
                    Fragmente, gânduri și conversații care continuă dincolo de pagină.
                  </p>
                </div>
              </div>
              <span className="bg-bone px-6 py-3.5 text-center font-sans text-[13px] tracking-wide text-ink transition-colors group-hover:bg-ember">
                Vezi Jurnalul lui Icarus pe TikTok
              </span>
            </a>
          </div>
        </div>

        <div className="container-editorial mt-16 border-t border-bone/10 pt-10">
          <p className="max-w-lg font-sans text-sm text-ash">
            Vrei să descoperi și cărțile din spatele acestui univers?{" "}
            <Link href="/carti" className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-ember hover:decoration-ember">
              Vezi Sub umbrele lui Blake și Îmbrățișarea durerii și avantajele ei.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
