export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date YYYY-MM-DD */
  publishedAt: string;
  tags: string[];
  blocks: BlogBlock[];
};

export type BlogPostSummary = Pick<
  BlogPost,
  "slug" | "title" | "excerpt" | "publishedAt" | "tags"
> & { readingMinutes: number };
