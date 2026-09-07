export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.danielimbrea.ro";

import { BRAND_NAME } from "@/lib/brand";

export const SITE_NAME = BRAND_NAME;

export const SITE_DESCRIPTION =
  "Site-ul oficial al scriitorului Daniel Imbrea. Descoperă „Sub umbrele lui Blake” și „Îmbrățișarea durerii și avantajele ei”, universul Jurnalul lui Icarus și comandă direct cărțile.";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
