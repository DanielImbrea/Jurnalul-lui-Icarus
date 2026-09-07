import ReviewCard, { type ReviewDisplay } from "./ReviewCard";

interface ReviewsGridProps {
  reviews: ReviewDisplay[];
  className?: string;
}

export default function ReviewsGrid({ reviews, className = "" }: ReviewsGridProps) {
  if (reviews.length === 0) return null;

  return (
    <ul
      className={`grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {reviews.map((review) => (
        <li key={review.id} className="min-w-0">
          <ReviewCard review={review} variant="grid" />
        </li>
      ))}
    </ul>
  );
}
