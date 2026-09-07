import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Comandă confirmată",
  robots: { index: false, follow: false }
};

async function getSessionSummary(sessionId?: string) {
  if (!sessionId) return null;
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      email: session.customer_details?.email ?? null,
      productTitle: (session.metadata?.productTitle as string) ?? null,
      amount: session.amount_total ? session.amount_total / 100 : null
    };
  } catch (error) {
    console.error("Nu am putut încărca sesiunea Stripe:", error);
    return null;
  }
}

export default async function SuccesPage({
  searchParams
}: {
  searchParams: { session_id?: string };
}) {
  const summary = await getSessionSummary(searchParams.session_id);

  return (
    <>
      <PageHero
        eyebrow="Comandă confirmată"
        title="Mulțumim. Povestea abia începe."
        atmosphere="durere"
      />

      <section className="relative py-24">
        <div className="container-editorial max-w-xl">
          {summary ? (
            <div className="space-y-4 font-sans text-[15px] leading-relaxed text-mist">
              {summary.productTitle && (
                <p>
                  Comanda pentru <span className="text-bone">{summary.productTitle}</span> a
                  fost confirmată.
                </p>
              )}
              {summary.amount !== null && <p>Sumă plătită: {summary.amount} lei.</p>}
              {summary.email && (
                <p>Confirmarea a fost trimisă la adresa {summary.email}.</p>
              )}
              <p className="text-ash">
                Cartea va fi expediată în câteva zile lucrătoare. Dacă ai
                întrebări despre comandă, ne poți scrie oricând.
              </p>
            </div>
          ) : (
            <p className="font-sans text-[15px] leading-relaxed text-mist">
              Comanda ta a fost înregistrată. Vei primi confirmarea pe
              email în câteva minute.
            </p>
          )}

          <Link
            href="/"
            className="mt-10 inline-block border border-bone/40 px-7 py-3.5 font-sans text-[13px] tracking-wide text-bone transition-colors hover:border-ember hover:text-ember"
          >
            Înapoi acasă
          </Link>
        </div>
      </section>
    </>
  );
}
