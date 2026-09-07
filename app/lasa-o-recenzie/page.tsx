import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ReviewForm from "@/components/reviews/ReviewForm";
import type { BookId } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Lasă o recenzie",
  description:
    "Fiecare cititor găsește într-o carte ceva ce îi aparține. Lasă o recenzie pentru cei care vin după tine."
};

interface PageProps {
  searchParams: { carte?: string };
}

export default function ReviewPage({ searchParams }: PageProps) {
  const bookParam = searchParams.carte;
  const defaultBookId =
    bookParam === "blake" || bookParam === "durere"
      ? (bookParam as BookId)
      : undefined;

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
    </>
  );
}
