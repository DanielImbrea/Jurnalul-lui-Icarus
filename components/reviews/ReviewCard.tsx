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
  variant?: "default" | "featured" | "compact" | "grid";
}

export default function ReviewCard({
  review,
  variant = "default"
}: ReviewCardProps) {
  const isFeatured = variant === "featured";
  const isGrid = variant === "grid";
  const isCompact = variant === "compact";

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-bone/10 bg-charcoal/30 shadow-[0_24px_64px_rgba(0,0,0,0.35)] ${
        isGrid
          ? "flex h-full flex-col rounded-xl p-5 shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
          : isFeatured
            ? "p-10 md:p-12"
            : "p-8"
      }`}
    >
      <StarRating
        rating={review.rating}
        size={isFeatured ? "lg" : isGrid ? "sm" : "md"}
      />

      <blockquote
        className={`font-serif leading-relaxed text-bone ${
          isFeatured
            ? "mt-6 text-2xl md:text-3xl"
            : isGrid
              ? "mt-3 line-clamp-4 flex-1 text-[15px]"
              : isCompact
                ? "mt-4 text-base"
                : "mt-6 text-lg"
        }`}
      >
        „{review.content}”
      </blockquote>

      <footer
        className={`flex flex-wrap items-center ${
          isGrid ? "mt-4 gap-x-3 gap-y-1" : "mt-8 gap-x-4 gap-y-2"
        }`}
      >
        <cite
          className={`not-italic text-mist ${
            isGrid ? "font-sans text-xs" : "font-sans text-sm"
          }`}
        >
          — {review.name}
        </cite>
        {review.verifiedPurchase && <VerifiedBadge />}
      </footer>

      {review.imageUrl && (
        <figure className={isGrid ? "mt-4 flex justify-center" : "mt-8 max-w-full"}>
          <div
            className={`overflow-hidden rounded-lg border border-bone/10 bg-ink/25 ${
              isGrid ? "w-full" : "inline-block"
            }`}
          >
            <Image
              src={review.imageUrl}
              alt={`Fotografie de la ${review.name}`}
              width={480}
              height={640}
              className={`mx-auto h-auto w-auto max-w-full object-contain ${
                isFeatured
                  ? "max-h-[28rem]"
                  : isGrid
                    ? "max-h-36"
                    : isCompact
                      ? "max-h-44"
                      : "max-h-64"
              }`}
              sizes={
                isGrid
                  ? "(max-width: 640px) 45vw, 240px"
                  : "(max-width: 768px) 100vw, 480px"
              }
            />
          </div>
        </figure>
      )}
    </article>
  );
}
