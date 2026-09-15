import type { MetadataRoute } from "next";
import { getAllBlogSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllBlogSlugs();

  const routes = [
    "",
    "/carti",
    "/carti/sub-umbrele-lui-blake",
    "/carti/imbratisarea-durerii-si-avantajele-ei",
    "/despre-autor",
    "/comunitate",
    "/galeria-cititorilor",
    "/recenzii",
    "/cititorii-lui-icarus",
    "/blog",
    "/din-universul-lui-icarus",
    "/jurnalul-lui-icarus",
    "/lasa-o-recenzie",
    "/comanda",
    "/contact",
    "/termeni-si-conditii",
    "/politica-de-confidentialitate",
    "/politica-de-retur",
    "/politica-de-cookies",
    "/livrare-si-comenzi"
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/blog" ? 0.85 : 0.7
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75
  }));

  return [...staticEntries, ...blogEntries];
}
