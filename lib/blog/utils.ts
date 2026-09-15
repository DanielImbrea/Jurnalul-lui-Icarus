import type { BlogBlock, BlogPost, BlogPostSummary } from "./types";

const WORDS_PER_MINUTE = 200;

export function countWords(blocks: BlogBlock[]): number {
  let n = 0;
  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "quote") {
      n += block.text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === "heading") {
      n += block.text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === "list") {
      for (const item of block.items) {
        n += item.split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return n;
}

export function readingMinutes(blocks: BlogBlock[]): number {
  return Math.max(1, Math.ceil(countWords(blocks) / WORDS_PER_MINUTE));
}

export function formatReadingLabel(minutes: number): string {
  if (minutes === 1) return "1 minut de citire";
  return `${minutes} minute de citire`;
}

export function toSummary(post: BlogPost): BlogPostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    tags: post.tags,
    readingMinutes: readingMinutes(post.blocks)
  };
}

const RO_MONTHS = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie"
] as const;

export function isBlogPostLive(publishedAt: string, now = new Date()): boolean {
  const today = now.toISOString().slice(0, 10);
  return publishedAt <= today;
}

export function formatPublishedDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const month = RO_MONTHS[m - 1];
  return `${d} ${month} ${y}`;
}
