import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/carti",
    "/carti/sub-umbrele-lui-blake",
    "/carti/imbratisarea-durerii-si-avantajele-ei",
    "/despre-autor",
    "/galeria-cititorilor",
    "/cititorii-lui-icarus",
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

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
