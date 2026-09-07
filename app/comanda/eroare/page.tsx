import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Plata a fost anulată",
  robots: { index: false, follow: false }
};

export default function EroarePage() {
  return (
    <>
      <PageHero
        eyebrow="Comandă neterminată"
        title="Plata a fost anulată."
        description="Nu s-a efectuat nicio plată. Poți relua comanda oricând."
        atmosphere="neutral"
      />
      <section className="relative py-24">
        <div className="container-editorial flex flex-wrap gap-4">
          <Link
            href="/comanda"
            className="bg-bone px-7 py-3.5 font-sans text-[13px] tracking-wide text-ink transition-colors hover:bg-ember"
          >
            Încearcă din nou
          </Link>
          <Link
            href="/contact"
            className="border border-bone/40 px-7 py-3.5 font-sans text-[13px] tracking-wide text-bone transition-colors hover:border-ember hover:text-ember"
          >
            Ai nevoie de ajutor?
          </Link>
        </div>
      </section>
    </>
  );
}
