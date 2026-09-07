"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageAtmosphere from "@/components/PageAtmosphere";
import { ToastProvider } from "@/components/ToastProvider";
import { CartProvider } from "@/components/cart/CartProvider";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      <CartProvider>
        <Navbar />
        <main className="relative max-w-full overflow-x-clip">
          <PageAtmosphere fixed subtle smoke={10} dust="medium" shootingStars={2} />
          <div className="relative z-[1] min-w-0 max-w-full">{children}</div>
        </main>
        <Footer />
      </CartProvider>
    </ToastProvider>
  );
}
