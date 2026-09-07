import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactează-l pe Daniel Imbrea pe TikTok — Jurnalul lui Icarus.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Mă găsești pe TikTok."
        description={
          <>
            <p>
              Dacă vrei să-mi scrii, îmi poți lăsa un mesaj acolo. Este locul în
              care țin legătura cu cei care urmăresc ceea ce fac și în care
              primesc cel mai des mesaje de la cititori.
            </p>
            <p>
              Dacă ai citit una dintre cărțile mele și vrei să-mi spui cum ți
              s-a părut, să-mi povestești despre experiența ta sau pur și simplu
              să-mi scrii câteva rânduri despre tine, mi-ar face plăcere să te
              ascult.
            </p>
          </>
        }
        atmosphere="neutral"
      />

      <section className="relative py-24">
        <div className="container-editorial max-w-xl">
          <div className="rounded-xl border border-bone/10 bg-charcoal/30 p-10 text-center">
            <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
              Jurnalul lui Icarus
            </p>
            <p className="mt-4 font-serif text-3xl text-bone">{TIKTOK_HANDLE}</p>
            <p className="mx-auto mt-5 max-w-sm font-sans text-sm leading-relaxed text-ash">
              Mesaje, întrebări despre cărți, comenzi sau pur și simplu o parte
              din povestea ta — acolo ne găsești.
            </p>

            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8"
            >
              Deschide TikTok
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
