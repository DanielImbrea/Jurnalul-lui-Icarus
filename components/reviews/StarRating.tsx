interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  value?: number;
  onChange?: (value: number) => void;
  ariaLabel?: string;
}

const sizes = {
  sm: "text-sm tracking-wider",
  md: "text-base tracking-widest",
  lg: "text-lg tracking-widest"
};

export default function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  value,
  onChange,
  ariaLabel
}: StarRatingProps) {
  const display = interactive ? value ?? 0 : rating;
  const label = ariaLabel ?? `Nota: ${display} din ${max} stele`;

  return (
    <div
      className={`inline-flex gap-0.5 ${sizes[size]}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={label}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < display;
        const star = filled ? "★" : "☆";

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={i + 1 === display}
              onClick={() => onChange?.(i + 1)}
              className={`transition-colors ${
                filled ? "text-ember" : "text-ash/40 hover:text-ember/60"
              }`}
            >
              {star}
            </button>
          );
        }

        return (
          <span key={i} className={filled ? "text-ember" : "text-ash/30"}>
            {star}
          </span>
        );
      })}
    </div>
  );
}
