import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getPublishedEditorialPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Din universul lui Icarus",
  description:
    "Fragmente, gânduri, povești din spatele cărților și noutăți din universul lui Daniel Imbrea."
};

export default async function EditorialIndexPage() {
  const posts = await getPublishedEditorialPosts();

  return (
    <>
      <PageHero
        eyebrow="Editorial"
        title="Din universul lui Icarus"
        description="Fragmente, gânduri, povești din spatele cărților — un spațiu editorial, nu un forum."
        atmosphere="neutral"
      />

      <section className="relative py-24">
        <div className="container-editorial">
          {posts.length === 0 ? (
            <p className="max-w-lg font-sans text-[15px] leading-relaxed text-ash">
              Aici vor apărea fragmente, citate, gânduri și noutăți din
              universul cărților. Conținut curat, editorial, fără comentarii
              publice între cititori.
            </p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/din-universul-lui-icarus/${post.slug}`}
                  className="group border border-bone/10 bg-charcoal/30 p-8 transition-colors hover:border-bone/20"
                >
                  <h2 className="font-serif text-2xl text-bone group-hover:text-ember">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-4 font-sans text-sm leading-relaxed text-ash">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
