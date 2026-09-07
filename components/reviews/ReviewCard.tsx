import Image from "next/image";
import StarRating from "./StarRating";
import VerifiedBadge from "./VerifiedBadge";

export interface ReviewDisplay {
  id: string;
  name: string;
  rating: number;
  content: string;
  imageUrl?: string | null;
  verifiedPurchase?: boolean;
  featured?: boolean;
}

interface ReviewCardProps {
  review: ReviewDisplay;
  variant?: "default" | "featured" | "compact";
}

export default function ReviewCard({
  review,
  variant = "default"
}: ReviewCardProps) {
  const isFeatured = variant === "featured";

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-bone/10 bg-charcoal/30 shadow-[0_24px_64px_rgba(0,0,0,0.35)] ${
        isFeatured ? "p-10 md:p-12" : "p-8"
      }`}
    >
      <StarRating rating={review.rating} size={isFeatured ? "lg" : "md"} />

      <blockquote
        className={`mt-6 font-serif leading-relaxed text-bone ${
          isFeatured ? "text-2xl md:text-3xl" : "text-lg"
        }`}
      >
        „{review.content}”
      </blockquote>

      <footer className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <cite className="font-sans text-sm not-italic text-mist">— {review.name}</cite>
        {review.verifiedPurchase && <VerifiedBadge />}
      </footer>

      {review.imageUrl && (
        <div className="mt-8 overflow-hidden border border-bone/10">
          <div className="relative aspect-[4/3] max-h-48 w-full max-w-xs">
            <Image
              src={review.imageUrl}
              alt={`Fotografie de la ${review.name}`}
              fill
              className="object-cover opacity-90"
              sizes="320px"
            />
          </div>
        </div>
      )}
    </article>
  );
}
