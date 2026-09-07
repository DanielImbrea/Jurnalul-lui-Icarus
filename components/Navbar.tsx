"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useCart } from "@/components/cart/CartProvider";

const links = [
  { href: "/carti", label: "Cărțile" },
  { href: "/galeria-cititorilor", label: "Galeria cititorilor" },
  { href: "/lasa-o-recenzie", label: "Lasă o recenzie" },
  { href: "/despre-autor", label: "Despre autor" },
  { href: "/contact", label: "Contact" }
];

function CartLink({
  className = "",
  iconOnly = false
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const { itemCount, hydrated } = useCart();

  return (
    <Link
      href="/comanda"
      className={`relative inline-flex items-center gap-2 ${className}`}
      aria-label={
        hydrated && itemCount > 0
          ? `Coș, ${itemCount} ${itemCount === 1 ? "produs" : "produse"}`
          : "Coș"
      }
    >
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      {!iconOnly ? <span>Coș</span> : null}
      {hydrated && itemCount > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 font-sans text-[10px] font-medium text-ink">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}

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
          <CartLink className="btn-secondary !px-5 !py-2 text-[12px]" />
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <CartLink
            iconOnly
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-bone/10 text-bone transition-colors hover:border-ember/40 hover:text-ember"
          />
          <button
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-bone/10"
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
                Coș
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
