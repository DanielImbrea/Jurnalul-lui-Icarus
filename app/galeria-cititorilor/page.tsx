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
              Galeria se va umple treptat, cu fotografii de la cititori.
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
            Fiecare cititor trăiește o carte în felul său. Uneori rămâne un
            personaj, alteori o idee, o emoție sau un pasaj la care te întorci
            fără să-ți dai seama de ce.
          </p>
          <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-ash">
            Dacă ai citit una dintre cărțile mele, mi-ar plăcea să aflu ce a rămas
            cu tine după ultima pagină.
          </p>
          <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-ash">
            Poți trimite o fotografie cu exemplarul tău și, dacă dorești, câteva
            rânduri despre experiența ta de lectură. Cu acordul tău, fotografia și
            mesajul tău pot deveni parte din „Cititorii lui Icarus”, o colecție de
            imagini trimise de cei care au ales să le citească.
          </p>
          <div className="mt-10">
            <GalleryUploadForm />
          </div>
        </div>
      </section>
    </>
  );
}
