import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/types";
import BlogMetaBadge from "@/components/blog/BlogMetaBadge";

export default function BlogCard({
  post,
  isLatest = false
}: {
  post: BlogPostSummary;
  isLatest?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-ember/25 bg-charcoal/30 transition-all duration-300 hover:border-ember/50 hover:bg-charcoal/45"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-ember/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex flex-1 flex-col p-7 sm:p-8">
        <BlogMetaBadge
          publishedAt={post.publishedAt}
          readingMinutes={post.readingMinutes}
          variant="readingOnly"
        />

        <h2 className="mt-4 line-clamp-3 font-serif text-xl leading-snug text-bone transition-colors group-hover:text-ember sm:text-[1.35rem]">
          {post.title}
        </h2>

        <p className="mt-3 line-clamp-4 flex-1 font-sans text-sm leading-relaxed text-mist">
          {post.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="font-sans text-[13px] text-ember/90 underline decoration-ember/30 underline-offset-4 transition-colors group-hover:text-ember group-hover:decoration-ember/60">
            Citește articolul →
          </p>
          {isLatest ? <span className="blog-recent-badge">Recent</span> : null}
        </div>
      </div>
    </Link>
  );
}
