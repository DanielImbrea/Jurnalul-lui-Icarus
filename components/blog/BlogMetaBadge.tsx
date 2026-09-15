import { formatPublishedDate, formatReadingLabel } from "@/lib/blog/utils";

export default function BlogMetaBadge({
  publishedAt,
  readingMinutes
}: {
  publishedAt: string;
  readingMinutes: number;
}) {
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
