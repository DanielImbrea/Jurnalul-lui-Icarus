import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { products } from "@/lib/products";

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
      type: "card" as const,
      email: session.customer_details?.email ?? null,
      productTitle: (session.metadata?.productTitle as string) ?? null,
      amount: session.amount_total ? session.amount_total / 100 : null
    };
  } catch (error) {
    console.error("Nu am putut încărca sesiunea Stripe:", error);
    return null;
  }
}

async function getCodSummary(orderId?: string) {
  if (!orderId) return null;
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId, paymentMethod: "cod" }
    });
    if (!order) return null;
    const product = products[order.productId as keyof typeof products];
    return {
      type: "cod" as const,
      email: order.email,
      productTitle: product?.title ?? null,
      amount: order.amountTotal / 100
    };
  } catch (error) {
    console.error("Nu am putut încărca comanda ramburs:", error);
    return null;
  }
}

export default async function SuccesPage({
  searchParams
}: {
  searchParams: { session_id?: string; cod?: string };
}) {
  const summary =
    (await getCodSummary(searchParams.cod)) ??
    (await getSessionSummary(searchParams.session_id));

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
                  Comanda pentru{" "}
                  <span className="text-bone">{summary.productTitle}</span> a
                  fost confirmată.
                </p>
              )}
              {summary.type === "cod" ? (
                <p>
                  Plata se face <span className="text-bone">ramburs la curier</span>{" "}
                  la livrare.
                </p>
              ) : null}
              {summary.amount !== null && (
                <p>
                  Total: {summary.amount} lei
                  {summary.type === "cod" ? " (ramburs)" : ""}.
                </p>
              )}
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
              Comanda ta a fost înregistrată. Vei primi confirmarea pe email în
              câteva minute.
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
