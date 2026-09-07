import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ReviewsGrid from "@/components/reviews/ReviewsGrid";
import { getAllApprovedReviews } from "@/lib/reviews";
import { products } from "@/lib/products";
import type { BookId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Recenzii de la cititori",
  description:
    "Ce au rămas cititorii cu ele după Sub umbrele lui Blake și Îmbrățișarea durerii și avantajele ei."
};

interface PageProps {
  searchParams: { carte?: string };
}

function resolveBookId(carte?: string): BookId | undefined {
  if (carte === "blake" || carte === "durere") return carte;
  return undefined;
}

export default async function RecenziiPage({ searchParams }: PageProps) {
  const bookId = resolveBookId(searchParams.carte);
  const reviews = await getAllApprovedReviews(bookId);
  const bookTitle = bookId ? products[bookId].title : null;

  return (
    <>
      <PageHero
        eyebrow="Cititorii lui Icarus"
        compact
        title={bookTitle ? `Recenzii — ${bookTitle}` : "Recenzii de la cititori"}
        description={
          bookTitle
            ? "Gânduri lăsate de cititorii acestei cărți."
            : "Fragmente din ce au trăit cititorii în universul Jurnalului lui Icarus."
        }
        atmosphere="neutral"
      />

      <section className="relative py-14 md:py-16">
        <div className="container-editorial">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            <FilterLink href="/recenzii" active={!bookId}>
              Toate
            </FilterLink>
            <FilterLink href="/recenzii?carte=blake" active={bookId === "blake"}>
              {products.blake.title}
            </FilterLink>
            <FilterLink href="/recenzii?carte=durere" active={bookId === "durere"}>
              {products.durere.title}
            </FilterLink>
          </div>

          {reviews.length > 0 ? (
            <ReviewsGrid reviews={reviews} />
          ) : (
            <p className="text-center font-sans text-[15px] text-mist">
              {bookTitle
                ? "Încă nu există recenzii aprobate pentru această carte."
                : "Încă nu există recenzii aprobate."}{" "}
              <Link
                href="/lasa-o-recenzie"
                className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-ember"
              >
                Fii primul care lasă una →
              </Link>
            </p>
          )}

          <div className="mt-12 text-center">
            <Link href="/lasa-o-recenzie" className="btn-primary">
              Lasă o recenzie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterLink({
  href,
  active,
  children
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 font-sans text-[12px] transition-colors ${
        active
          ? "border-ember/40 bg-ember/10 text-bone"
          : "border-bone/10 text-ash hover:border-bone/25 hover:text-mist"
      }`}
    >
      {children}
    </Link>
  );
}
