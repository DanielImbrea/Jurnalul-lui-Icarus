"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PendingKey = "pendingReviews" | "pendingPhotos" | "total";

const navItems: {
  href: string;
  label: string;
  pendingKey?: PendingKey;
}[] = [
  { href: "/admin", label: "Comunitate", pendingKey: "total" },
  { href: "/admin/reviews", label: "Recenzii", pendingKey: "pendingReviews" },
  { href: "/admin/gallery", label: "Galerie cititori", pendingKey: "pendingPhotos" },
  { href: "/admin/quotes", label: "Citate" },
  { href: "/admin/editorial", label: "Editorial" }
];

interface PendingStats {
  pendingReviews: number;
  pendingPhotos: number;
}

function pendingLabel(count: number) {
  if (count === 1) return "1 de aprobat";
  return `${count} de aprobat`;
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="inline-flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-ember px-1.5 text-[10px] font-medium leading-none text-ink">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState<PendingStats | null>(null);

  useEffect(() => {
    async function loadPending() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) return;
        const data = await res.json();
        setPending({
          pendingReviews: data.pendingReviews ?? 0,
          pendingPhotos: data.pendingPhotos ?? 0
        });
      } catch {
        // ignore — nav rămâne funcțional fără count
      }
    }

    loadPending();
    const interval = setInterval(loadPending, 60_000);
    return () => clearInterval(interval);
  }, [pathname]);

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const totalPending =
    (pending?.pendingReviews ?? 0) + (pending?.pendingPhotos ?? 0);

  function countFor(key?: PendingKey) {
    if (!pending || !key) return 0;
    if (key === "total") return totalPending;
    return pending[key];
  }

  return (
    <header className="sticky top-0 z-50 border-b border-bone/10 bg-ink/95 backdrop-blur-xl">
      <div className="container-editorial flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-serif text-lg text-bone">Admin · Icarus</p>
            {totalPending > 0 && (
              <span className="inline-flex items-center rounded-full border border-ember/30 bg-ember/15 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-ember">
                {pendingLabel(totalPending)}
              </span>
            )}
          </div>
          <p className="mt-1 font-sans text-[11px] text-ash">
            Moderare comunitate
            {pending && totalPending > 0 ? (
              <>
                {" · "}
                {pending.pendingReviews > 0 && (
                  <span>
                    {pending.pendingReviews}{" "}
                    {pending.pendingReviews === 1 ? "recenzie" : "recenzii"}
                  </span>
                )}
                {pending.pendingReviews > 0 && pending.pendingPhotos > 0 && (
                  <span>, </span>
                )}
                {pending.pendingPhotos > 0 && (
                  <span>
                    {pending.pendingPhotos}{" "}
                    {pending.pendingPhotos === 1 ? "fotografie" : "fotografii"}
                  </span>
                )}
              </>
            ) : null}
          </p>
        </div>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const count = countFor(item.pendingKey);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-sans text-[12px] transition-colors ${
                  pathname === item.href
                    ? "bg-bone/10 text-bone"
                    : "text-ash hover:text-bone"
                }`}
              >
                {item.label}
                <CountBadge count={count} />
              </Link>
            );
          })}
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
