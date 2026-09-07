"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Comunitate" },
  { href: "/admin/reviews", label: "Recenzii" },
  { href: "/admin/gallery", label: "Galerie cititori" },
  { href: "/admin/quotes", label: "Citate" },
  { href: "/admin/editorial", label: "Editorial" }
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-bone/10 bg-ink/95 backdrop-blur-xl">
      <div className="container-editorial flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-lg text-bone">Admin · Icarus</p>
          <p className="font-sans text-[11px] text-ash">Moderare comunitate</p>
        </div>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 font-sans text-[12px] transition-colors ${
                pathname === item.href
                  ? "bg-bone/10 text-bone"
                  : "text-ash hover:text-bone"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 font-sans text-[12px] text-ash hover:text-ember"
          >
            Ieșire
          </button>
        </nav>
      </div>
    </header>
  );
}
