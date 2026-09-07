"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { href: "/carti", label: "Cărțile" },
  { href: "/galeria-cititorilor", label: "Galeria cititorilor" },
  { href: "/lasa-o-recenzie", label: "Lasă o recenzie" },
  { href: "/despre-autor", label: "Despre autor" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-bone/10 bg-black/45 backdrop-blur-xl"
          : "bg-gradient-to-b from-ink/70 to-transparent"
      }`}
    >
      <div className="container-editorial flex h-[4.5rem] items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-[13px] transition-colors ${
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`))
                  ? "text-bone"
                  : "text-mist hover:text-bone"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/comanda" className="btn-secondary !px-5 !py-2 text-[12px]">
            Comandă
          </Link>
        </nav>

        <button
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-bone/10 lg:hidden"
        >
          <span
            className={`block h-px w-5 bg-bone transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-bone transition-transform ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-bone/10 bg-black/55 px-6 pb-8 pt-4 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-serif text-xl text-bone">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/comanda" className="btn-secondary mt-2">
                Comandă
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
