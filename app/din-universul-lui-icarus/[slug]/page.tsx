import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getEditorialPostBySlug } from "@/lib/content";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const post = await getEditorialPostBySlug(params.slug);
  if (!post) return { title: "Articol negăsit" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined
  };
}

export default async function EditorialPostPage({ params }: PageProps) {
  const post = await getEditorialPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <PageHero
        eyebrow="Din universul lui Icarus"
        title={post.title}
        description={post.excerpt ?? undefined}
        atmosphere="neutral"
      />

      <section className="relative py-24">
        <div className="container-editorial max-w-2xl">
          <div className="space-y-6 font-sans text-[16px] leading-relaxed text-mist whitespace-pre-wrap">
            {post.content}
          </div>

          <Link
            href="/din-universul-lui-icarus"
            className="mt-14 inline-block font-sans text-[13px] text-bone underline decoration-bone/30 underline-offset-4 hover:text-ember"
          >
            ← Înapoi
          </Link>
        </div>
      </section>
    </>
  );
}
