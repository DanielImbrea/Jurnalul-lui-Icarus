import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogCard from "@/components/blog/BlogCard";
import JsonLd from "@/components/JsonLd";
import { getAllBlogPosts } from "@/lib/blog";
import { BRAND_NAME } from "@/lib/brand";
import { SITE_DESCRIPTION, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog, lectură, psihologie și universul Icarus",
  description:
    "Articole despre cărți, relații, emoții și ficțiune, de Daniel Imbrea. Texte scurte, clare, pentru cititori care vor profunzime fără senzationalism.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog | ${BRAND_NAME}`,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/blog")
  }
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `Blog ${BRAND_NAME}`,
          description:
            "Reflecții despre durere, vindecare, relații și universul literar Jurnalul lui Icarus.",
          url: absoluteUrl("/blog"),
          publisher: {
            "@type": "Person",
            name: "Daniel Imbrea"
          },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: absoluteUrl(`/blog/${p.slug}`),
            datePublished: p.publishedAt
          }))
        }}
      />

      <PageHero
        eyebrow="Blog"
        title="Câteva minute doar pentru tine"
        subtitle="Pregătește-ți cafeaua. Avem ceva de citit."
        description={
          <>
            <p>
              Bine ai venit pe blogul {BRAND_NAME}, un loc în care poți
              descoperi articole despre cărți, lectură, relații, personaje,
              psihologie, emoții și subiecte care merită privite din mai multe
              perspective.
            </p>
            <p>
              Aici vei găsi atât articole inspirate de universul {BRAND_NAME},
              cât și idei, recomandări și discuții pentru cei care iubesc
              poveștile și lucrurile care rămân cu tine și după ce ai închis o
              carte.
            </p>
            <p className="text-ash">
              Fă-ți o cafea, alege un articol și rămâi puțin. Nu trebuie să te
              grăbești nicăieri. Sunt doar câteva minute de lectură.
            </p>
          </>
        }
        atmosphere="durere"
        scrollTo={{ href: "#articole", label: "Citește articolele" }}
      />

      <section id="articole" className="relative scroll-mt-24 py-24">
        <div className="container-editorial">
          {posts.length === 0 ? (
            <p className="font-sans text-ash">Articolele vor apărea curând.</p>
          ) : (
            <>
              <div className="mb-14 flex flex-col gap-4 border-b border-bone/10 pb-10 md:flex-row md:items-end md:justify-between">
                <h2 className="font-serif text-3xl text-bone sm:text-4xl">
                  Ultimele articole
                </h2>
                <p className="max-w-md font-sans text-sm leading-relaxed text-ash">
                  Despre cărți, oameni, relații și lucrurile pe care nu le
                  înțelegem întotdeauna din prima. Idei, perspective și povești
                  pentru câteva minute de lectură în liniște.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} isLatest={index === 0} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
