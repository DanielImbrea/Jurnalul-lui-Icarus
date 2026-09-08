import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CommunityPostForm from "@/components/community/CommunityPostForm";
import CommunityThreadList from "@/components/community/CommunityThreadList";
import { getApprovedCommunityThreads } from "@/lib/community-posts";
import { TIKTOK_HANDLE, TIKTOK_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Comunitate",
  description:
    "Comunitatea Jurnalul lui Icarus — un loc în care poți lăsa gânduri, confesiuni și întrebări. Pe TikTok și aici, pe site.",
  alternates: { canonical: "/comunitate" }
};

export const dynamic = "force-dynamic";

export default async function ComunitatePage() {
  const threads = await getApprovedCommunityThreads();

  return (
    <>
      <PageHero
        eyebrow="Comunitate"
        title="Un loc în care poți spune ce nu spui altundeva."
        description={
          <>
            <p>
              Comunitatea trăiește în două locuri: pe TikTok, unde conversația
              curge în timp real, și aici — un spațiu mai liniștit, unde poți
              lăsa gânduri nerostite, dorințe ascunse, confesiuni și
              întrebări care au rămas prea mult timp doar ale tale.
            </p>
            <p>
              Nu trebuie să fie perfect formulat. Poți scrie ce simți, ce te
              frământă, ce ai purtat prea mult timp singur. Mesajele sunt
              moderate înainte de publicare — ca să rămână un loc sigur pentru
              toată lumea.
            </p>
          </>
        }
        atmosphere="neutral"
        scrollTo={{ href: "#scrie", label: "Scrie un mesaj" }}
      />

      <section className="relative border-b border-bone/10 py-16">
        <div className="container-editorial grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-bone/10 bg-charcoal/30 p-8">
            <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
              Pe TikTok
            </p>
            <p className="mt-3 font-serif text-2xl text-bone">{TIKTOK_HANDLE}</p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-ash">
              Conversații zilnice, fragmente, reacții și comunitatea care a crescut
              în jurul cărților — toate își găsesc locul acolo.
            </p>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-6 inline-flex"
            >
              Deschide TikTok
            </a>
          </div>

          <div className="rounded-xl border border-wine/20 bg-gradient-to-br from-[#5A1E2A]/25 via-charcoal/40 to-ink/60 p-8">
            <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
              Aici, pe site
            </p>
            <p className="mt-3 font-serif text-2xl text-bone">Spațiul tău</p>
            <div className="mt-4 space-y-4 font-sans text-sm leading-relaxed text-mist">
              <p>
                Un loc în care poți lăsa jos ceea ce ai purtat prea mult timp
                singur.
              </p>
              <p>
                Scrie fără să cauți cuvintele perfecte. Despre ceea ce te apasă,
                ceea ce te-a rănit, despre o dorință pe care nu ai avut curajul
                să o rostești și care, cu timpul, a început să te doară, sau
                despre lucruri pe care le-ai păstrat prea mult timp doar pentru
                tine.
              </p>
              <p>
                Poate fi o confesiune, o întrebare, o teamă, o dorință sau pur
                și simplu un gând pe care simți nevoia să-l lași undeva.
              </p>
              <p className="text-bone">
                Nu trebuie să fie perfect. Trebuie doar să fie al tău.
              </p>
            </div>
            <p className="mt-5 rounded-lg border border-ember/25 bg-ember/10 px-4 py-3 font-sans text-sm leading-relaxed text-bone">
              Alți cititori pot răspunde, îți pot împărtăși propriile
              experiențe sau, pur și simplu, îți pot arăta că nu ești singur
              în ceea ce simți.
            </p>
            <Link href="#scrie" className="btn-primary mt-6 inline-flex">
              Scrie un mesaj
            </Link>
          </div>
        </div>
      </section>

      <section id="scrie" className="relative py-20">
        <div className="container-editorial max-w-2xl">
          <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
            Lasă un gând
          </p>
          <h2 className="mt-3 font-serif text-3xl text-bone">
            Ce ai simțit nevoia să spui?
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ash">
            Scrie liber. Mesajul tău va fi citit înainte de a apărea public.
            Poți răspunde și la mesajele altora — conversația continuă.
          </p>
          <div className="mt-8">
            <CommunityPostForm />
          </div>
        </div>
      </section>

      <section className="relative border-t border-bone/10 py-20">
        <div className="container-editorial max-w-3xl">
          <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ember">
            Conversații
          </p>
          <h2 className="mt-3 font-serif text-3xl text-bone">Ce s-a spus aici</h2>
          <div className="mt-10">
            <CommunityThreadList threads={threads} />
          </div>
        </div>
      </section>
    </>
  );
}
