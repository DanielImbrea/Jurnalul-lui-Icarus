import type { MetadataRoute } from "next";
import { BRAND_NAME } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: "Icarus",
    description:
      "Universul literar al lui Daniel Imbrea — Jurnalul lui Icarus.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#5A1E2A",
    icons: [
      {
        src: "/favicon-dual.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
