import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { CONTACT_EMAIL, TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactează-l pe Daniel Imbrea — email jurnalulluiicarus@gmail.com sau TikTok Jurnalul lui Icarus.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Scrie-mi sau găsește-mi online."
        description={
          <>
            <p>
              Dacă vrei să-mi scrii despre cărți, comenzi sau pur și simplu să
              împărtășești o parte din povestea ta, mă poți contacta pe email
              sau pe TikTok.
            </p>
            <p>
              Pe TikTok țin legătura cu cei care urmăresc ceea ce fac — acolo
              primesc cel mai des mesaje de la cititori.
            </p>
          </>
        }
        atmosphere="neutral"
      />

      <section className="relative py-24">
        <div className="container-editorial grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-bone/10 bg-charcoal/30 p-10 text-center">
            <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
              Email
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 block font-serif text-xl text-bone transition-colors hover:text-ember sm:text-2xl"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mx-auto mt-5 max-w-sm font-sans text-sm leading-relaxed text-ash">
              Comenzi, retururi, întrebări despre cărți sau colaborări — răspund
              cât de curând pot.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn-primary mt-8"
            >
              Trimite email
            </a>
          </div>

          <div className="rounded-xl border border-bone/10 bg-charcoal/30 p-10 text-center">
            <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
              Jurnalul lui Icarus
            </p>
            <p className="mt-4 font-serif text-3xl text-bone">{TIKTOK_HANDLE}</p>
            <p className="mx-auto mt-5 max-w-sm font-sans text-sm leading-relaxed text-ash">
              Mesaje, întrebări despre cărți sau pur și simplu o parte din
              povestea ta — acolo mă găsești.
            </p>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-8"
            >
              Deschide TikTok
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
