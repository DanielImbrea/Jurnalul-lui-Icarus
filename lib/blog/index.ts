import type { BlogPost, BlogPostSummary } from "./types";
import { isBlogPostLive, toSummary } from "./utils";
import { post as p01 } from "./posts/01-atasare";
import { post as p02 } from "./posts/02-durerea-si-fericirea";
import { post as p03 } from "./posts/03-despartire";
import { post as p04 } from "./posts/04-amintiri";
import { post as p05 } from "./posts/05-lupta-interioara";
import { post as p06 } from "./posts/06-imbratisarea-durerii";
import { post as p07 } from "./posts/07-suferinta";
import { post as p08 } from "./posts/08-dark-romance";
import { post as p09 } from "./posts/09-citate";
import { post as p10 } from "./posts/10-intoarcem-amintiri";
import { post as p11 } from "./posts/11-personaje-intunecate";
import { post as p12 } from "./posts/12-transformare";

const allPosts: BlogPost[] = [p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12];

/** Newest first by publish date; same-day posts follow series order (12 newest). */
function compareBlogPostsNewestFirst(a: BlogPost, b: BlogPost): number {
  const byDate = b.publishedAt.localeCompare(a.publishedAt);
  if (byDate !== 0) return byDate;
  return allPosts.indexOf(b) - allPosts.indexOf(a);
}

function livePosts(): BlogPost[] {
  return allPosts
    .filter((p) => isBlogPostLive(p.publishedAt))
    .sort(compareBlogPostsNewestFirst);
}

export function getAllBlogPosts(): BlogPostSummary[] {
  return livePosts().map(toSummary);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const post = allPosts.find((p) => p.slug === slug);
  if (!post || !isBlogPostLive(post.publishedAt)) return undefined;
  return post;
}

export function getAllBlogSlugs(): string[] {
  return livePosts().map((p) => p.slug);
}

export function getRelatedBlogPosts(slug: string, limit = 3): BlogPostSummary[] {
  const current = getBlogPostBySlug(slug);
  if (!current) return getAllBlogPosts().slice(0, limit);

  const tagSet = new Set(current.tags);
  const scored = livePosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => tagSet.has(t)).length
    }))
    .sort((a, b) => b.score - a.score || b.post.publishedAt.localeCompare(a.post.publishedAt));

  return scored.slice(0, limit).map(({ post }) => toSummary(post));
}
