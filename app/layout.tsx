import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import SiteShell from "@/components/SiteShell";
import { BRAND_NAME, TIKTOK_URL } from "@/lib/brand";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"]
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Sub umbrele lui Blake & Îmbrățișarea durerii și avantajele ei`,
    template: `%s — ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Daniel Imbrea",
    "Sub umbrele lui Blake",
    "Întunericul nu este pentru oricine",
    "Îmbrățișarea durerii și avantajele ei",
    "Jurnalul lui Icarus",
    "cărți Daniel Imbrea",
    "autor Daniel Imbrea",
    "carte română dark romance"
  ],
  authors: [{ name: "Daniel Imbrea" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — universul literar`,
    description: SITE_DESCRIPTION,
    url: SITE_URL
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — universul literar`,
    description: SITE_DESCRIPTION
  },
  icons: {
    icon: [
      { url: "/favicon-dual.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" }
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon-dual.svg"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="relative font-sans antialiased">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Daniel Imbrea",
            url: SITE_URL,
            jobTitle: "Scriitor",
            sameAs: [TIKTOK_URL]
          }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
