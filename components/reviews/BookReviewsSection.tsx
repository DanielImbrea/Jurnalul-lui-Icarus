import Link from "next/link";
import ReviewsGrid from "./ReviewsGrid";
import StarRating from "./StarRating";
import {
  getApprovedReviewsForBook,
  getBookReviewStats,
  toReviewDisplays
} from "@/lib/reviews";
import type { BookId } from "@/lib/validation";

const PREVIEW_COUNT = 5;

interface BookReviewsSectionProps {
  bookId: BookId;
}

export default async function BookReviewsSection({
  bookId
}: BookReviewsSectionProps) {
  const [reviews, stats] = await Promise.all([
    getApprovedReviewsForBook(bookId, { limit: PREVIEW_COUNT }),
    getBookReviewStats(bookId)
  ]);

  if (stats.count === 0) {
    return null;
  }

  const hasMore = stats.count > reviews.length;

  return (
    <section className="relative border-t border-bone/10 py-24">
      <div className="container-editorial">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-[13px] uppercase tracking-[0.16em] text-ember">
            Cititorii lui Icarus
          </p>
          <h2 className="mt-3 font-serif text-3xl text-bone sm:text-4xl">
            Ce au rămas cu ei
          </h2>

          {stats.averageRating && (
            <div className="mt-5 flex flex-col items-center">
              <StarRating rating={Math.round(stats.averageRating)} />
              <p className="mt-2 font-sans text-sm text-ash">
                {stats.averageRating} · {stats.count}{" "}
                {stats.count === 1 ? "recenzie" : "recenzii"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <ReviewsGrid
            reviews={toReviewDisplays(reviews)}
            className="lg:grid-cols-4 xl:grid-cols-5"
          />
        </div>

        {hasMore && (
          <div className="mt-10 text-center">
            <Link
              href={`/recenzii?carte=${bookId}`}
              className="btn-secondary"
            >
              Vezi toate recenziile ({stats.count})
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
