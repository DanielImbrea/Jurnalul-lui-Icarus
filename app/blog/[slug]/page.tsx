import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blog/BlogCard";
import BlogMetaBadge from "@/components/blog/BlogMetaBadge";
import BlogProse from "@/components/blog/BlogProse";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
  getRelatedBlogPosts
} from "@/lib/blog";
import { readingMinutes } from "@/lib/blog/utils";
import { BRAND_NAME } from "@/lib/brand";
import { absoluteUrl } from "@/lib/seo";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return { title: "Articol negăsit" };

  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt
    }
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedBlogPosts(post.slug, 3);
  const minutes = readingMinutes(post.blocks);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: {
            "@type": "Person",
            name: "Daniel Imbrea",
            url: absoluteUrl("/despre-autor")
          },
          publisher: {
            "@type": "Organization",
            name: BRAND_NAME,
            url: absoluteUrl("/")
          },
          mainEntityOfPage: url,
          url,
          keywords: post.tags.join(", ")
        }}
      />

      <PageHero
        eyebrow="Blog"
        title={post.title}
        description={post.excerpt}
        atmosphere="durere"
        compact
      />

      <section className="relative py-16 md:py-24">
        <div className="container-editorial max-w-3xl">
          <div className="mb-12 flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-bone/10 pb-8">
            <BlogMetaBadge publishedAt={post.publishedAt} readingMinutes={minutes} />
            <span className="font-sans text-sm text-mist">Daniel Imbrea</span>
          </div>

          <BlogProse blocks={post.blocks} />

          <div className="mt-16 flex flex-col gap-6 border-t border-bone/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="font-sans text-[13px] text-bone underline decoration-bone/30 underline-offset-4 hover:text-ember"
            >
              ← Toate articolele
            </Link>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-ember/25 px-3 py-1 font-sans text-[11px] uppercase tracking-wider text-ash"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="mt-20 rounded-xl border border-ember/25 bg-charcoal/25 p-8 md:p-10">
            <p className="font-sans text-[12px] uppercase tracking-[0.14em] text-ember">
              Din cărți
            </p>
            <p className="mt-3 font-serif text-2xl text-bone">
              Aceleași întrebări, spuse ca poveste.
            </p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-mist">
              Dacă vrei să vezi cum arată atașamentul, ruptura sau vindecarea
              pe pagină, nu doar în articole, începe cu „Sub Umbrele lui
              Blake” sau „Îmbrățișarea Durerii și Avantajele ei”.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/carti"
                className="inline-flex rounded-lg border border-ember/35 bg-bone/5 px-5 py-2.5 font-sans text-[13px] text-bone transition-colors hover:border-ember/55 hover:text-ember"
              >
                Vezi cărțile
              </Link>
              <Link
                href="/comunitate"
                className="inline-flex px-5 py-2.5 font-sans text-[13px] text-ash underline decoration-bone/25 underline-offset-4 hover:text-bone"
              >
                Comunitatea cititorilor
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-bone/10 py-20">
          <div className="container-editorial">
            <h2 className="font-serif text-2xl text-bone sm:text-3xl">Articole asemănătoare</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
