import { formatPublishedDate, formatReadingLabel } from "@/lib/blog/utils";

export default function BlogMetaBadge({
  publishedAt,
  readingMinutes,
  variant = "full"
}: {
  publishedAt: string;
  readingMinutes: number;
  /** Card grid: reading time only. Article page: date + reading time. */
  variant?: "full" | "readingOnly";
}) {
  if (variant === "readingOnly") {
    return (
      <div className="blog-meta-badge blog-meta-badge-compact">
        <span>{formatReadingLabel(readingMinutes)}</span>
      </div>
    );
  }

  return (
    <div className="blog-meta-badge">
      <time dateTime={publishedAt}>{formatPublishedDate(publishedAt)}</time>
      <span className="blog-meta-badge-divider" aria-hidden />
      <span className="blog-meta-badge-reading">
        {formatReadingLabel(readingMinutes)}
      </span>
    </div>
  );
}
