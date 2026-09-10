import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewsGrid from "@/components/reviews/ReviewsGrid";
import { getAllApprovedReviews, toReviewDisplays } from "@/lib/reviews";
import type { BookId } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lasă o recenzie",
  description:
    "Fiecare cititor găsește într-o carte ceva ce îi aparține. Lasă o recenzie pentru cei care vin după tine."
};

interface PageProps {
  searchParams: { carte?: string };
}

export default async function ReviewPage({ searchParams }: PageProps) {
  const bookParam = searchParams.carte;
  const defaultBookId =
    bookParam === "blake" || bookParam === "durere"
      ? (bookParam as BookId)
      : undefined;
  const reviews = toReviewDisplays(await getAllApprovedReviews());

  return (
    <>
      <PageHero
        eyebrow="Dincolo de ultima pagină"
        compact
        title={
          <>
            Fiecare cititor găsește într-o carte
            <br />
            <span className="italic text-mist">ceva ce îi aparține.</span>
          </>
        }
        description="Unele se duc în tăcere. Altele merită spuse. Dacă cartea a rămas cu tine, lasă un semn pentru cei care încă n-au ajuns la ea."
        atmosphere="neutral"
      />

      <section className="relative py-14 md:py-16">
        <div className="container-editorial max-w-2xl">
          <ReviewForm defaultBookId={defaultBookId} />
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="relative border-t border-bone/10 py-16 md:py-24">
          <div className="container-editorial">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sans text-[13px] uppercase tracking-[0.16em] text-ember">
                Cititorii lui Icarus
              </p>
              <h2 className="mt-3 font-serif text-3xl text-bone sm:text-4xl">
                Ce au rămas cu ei
              </h2>
              <p className="mt-4 font-sans text-sm text-ash">
                Toate recenziile lăsate de cititori — pentru ambele cărți.
              </p>
            </div>

            <div className="mt-12">
              <ReviewsGrid reviews={reviews} className="lg:grid-cols-4" />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
