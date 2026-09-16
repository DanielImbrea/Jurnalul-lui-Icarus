import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import PageHero from "@/components/PageHero";
import { CONTACT_EMAIL, TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    `Contactează-l pe Daniel Imbrea — email ${CONTACT_EMAIL} sau TikTok Jurnalul lui Icarus.`,
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Jurnalul lui Icarus"
        title="Contact"
        description={
          <>
            <p>
              Dacă vrei să-mi scrii despre cărți, despre o comandă sau pur și
              simplu să împărtășești ceva din povestea ta, mă poți contacta
              oricând prin email sau pe TikTok.
            </p>
            <p>
              Pe TikTok sunt cel mai aproape de cititori și acolo primesc cel
              mai des mesaje despre cărți, lectură și poveștile care au ajuns
              la ei.
            </p>
          </>
        }
        atmosphere="neutral"
      />

      <section className="relative py-24">
        <div className="container-editorial mx-auto flex max-w-3xl flex-col gap-10">
        <div className="grid gap-6 md:grid-cols-2">
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
              TikTok
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

          <ContactForm />
        </div>
      </section>
    </>
  );
}
