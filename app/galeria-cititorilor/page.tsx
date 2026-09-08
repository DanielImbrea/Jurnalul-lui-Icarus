import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ReaderGalleryGrid from "@/components/gallery/ReaderGalleryGrid";
import GalleryUploadForm from "@/components/gallery/GalleryUploadForm";
import { getApprovedGalleryPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Galeria cititorilor",
  description:
    "Fotografii reale de la cititorii Jurnalului lui Icarus — acolo unde au ajuns cărțile."
};

export const dynamic = "force-dynamic";

export default async function GaleriaCititorilorPage() {
  const photos = await getApprovedGalleryPhotos(48);

  return (
    <>
      <PageHero
        eyebrow="Comunitatea"
        title="Galeria cititorilor"
        description="Fiecare carte pleacă din mâinile autorului și își găsește, în cele din urmă, propriul loc în mâinile unui cititor."
        atmosphere="neutral"
        scrollTo={{ href: "#trimite", label: "Poți lăsa o fotografie aici" }}
      />

      <section className="relative border-b border-bone/10 py-14">
        <div className="container-editorial grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
              Comunitate
            </p>
            <h2 className="mt-3 font-serif text-2xl text-bone">
              Mai mult decât fotografii
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-ash">
              Comunitatea trăiește și pe TikTok, și aici pe site. Dacă vrei să
              lași cuvinte, nu doar imagini — gânduri ascunse, stări, întrebări
              — poți face asta în spațiul Comunitate. Poți răspunde și tu, iar
              eu pot răspunde la mesajele care au nevoie de o voce.
            </p>
            <Link href="/comunitate" className="btn-secondary mt-6 inline-flex">
              Mergi la Comunitate
            </Link>
          </div>
          <div className="rounded-xl border border-bone/10 bg-charcoal/30 p-6">
            <p className="font-sans text-sm leading-relaxed text-mist">
              Galeria este pentru imagini — locul în care cartea ta prinde formă
              vizuală. Comunitatea este pentru cuvinte — locul în care te poți
              descărca de ce ai purtat prea mult timp singur.
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-14 md:py-16">
        <div className="container-editorial">
          {photos.length === 0 ? (
            <p className="mb-8 max-w-lg font-sans text-[15px] leading-relaxed text-ash">
              Galeria se va umple treptat, cu fotografii reale de la cititori.
            </p>
          ) : (
            <p className="mb-8 font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
              Din comunitate
            </p>
          )}
          <ReaderGalleryGrid photos={photos} />
        </div>
      </section>

      <section id="trimite" className="relative border-t border-bone/10 py-24">
        <div className="container-editorial max-w-2xl">
          <p className="font-sans text-[13px] text-ember">Trimite-mi</p>
          <h2 className="mt-3 font-serif text-3xl text-bone">
            Povestea prin ochii tăi
          </h2>
          <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-ash">
            Fie că o citești acum, fie că așteaptă pe noptieră, fie că și-a găsit
            deja locul ei — trimite-mi o fotografie a exemplarului tău și, în câteva
            cuvinte, spune-mi cum ai simțit-o și dacă ți-a trezit vreo întrebare,
            dorință sau stare pe care ai simțit nevoia să o explorezi.
          </p>
          <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-ash">
            Voi vedea fiecare fotografie înainte ca ea să ajungă aici, iar dacă îmi
            dai acordul, poate va deveni parte din „Cititorii lui Icarus”.
          </p>
          <div className="mt-10">
            <GalleryUploadForm />
          </div>
        </div>
      </section>
    </>
  );
}
