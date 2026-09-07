import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/comanda/succes", "/comanda/eroare"]
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
