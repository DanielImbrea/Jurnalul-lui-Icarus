import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import {
  getApprovedReviewsForBook,
  getBookReviewStats
} from "@/lib/reviews";
import type { BookId } from "@/lib/validation";

interface BookReviewsSectionProps {
  bookId: BookId;
}

export default async function BookReviewsSection({
  bookId
}: BookReviewsSectionProps) {
  const [reviews, stats] = await Promise.all([
    getApprovedReviewsForBook(bookId, { limit: 6 }),
    getBookReviewStats(bookId)
  ]);

  if (stats.count === 0) {
    return null;
  }

  const featured = reviews.find((r) => r.featured) ?? reviews[0];
  const rest = reviews.filter((r) => r.id !== featured?.id).slice(0, 3);

  return (
    <section className="relative border-t border-bone/10 py-24">
      <div className="container-editorial">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-[13px] text-ember">Cititorii lui Icarus</p>
            <h2 className="mt-3 font-serif text-3xl text-bone sm:text-4xl">
              Ce au rămas cu ei
            </h2>
          </div>

          {stats.averageRating && (
            <div className="text-left md:text-right">
              <StarRating rating={Math.round(stats.averageRating)} />
              <p className="mt-2 font-sans text-sm text-ash">
                {stats.averageRating} · {stats.count}{" "}
                {stats.count === 1 ? "recenzie" : "recenzii"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {featured && (
            <div className="lg:col-span-7">
              <ReviewCard review={featured} variant="featured" />
            </div>
          )}

          {rest.length > 0 && (
            <div className="flex flex-col gap-6 lg:col-span-5">
              {rest.map((review) => (
                <ReviewCard key={review.id} review={review} variant="compact" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
