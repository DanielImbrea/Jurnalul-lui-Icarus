"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageAtmosphere from "@/components/PageAtmosphere";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="relative">
        <PageAtmosphere fixed subtle smoke={10} dust="medium" shootingStars={2} />
        <div className="relative z-[1]">{children}</div>
      </main>
      <Footer />
    </>
  );
}
