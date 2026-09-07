import type { Metadata } from "next";
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
            Unde a ajuns cartea ta?
          </h2>
          <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-ash">
            Poate o citești acum, poate stă pe noptieră sau poate ai găsit deja
            locul potrivit pentru ea. Dacă vrei, trimite-mi o fotografie cu cartea
            ta și spune-mi, în câteva cuvinte, unde te-a găsit.
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
