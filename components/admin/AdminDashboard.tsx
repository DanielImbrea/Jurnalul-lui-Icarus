"use client";

import Link from "next/link";
import type { AdminStats } from "@/lib/admin/stats";

export default function AdminDashboard({
  initialStats
}: {
  initialStats: AdminStats;
}) {
  const stats = initialStats;

  const cards = [
    { label: "Comenzi de expediat", value: stats.pendingOrders, href: "/admin/orders" },
    { label: "Total Reviews", value: stats.totalReviews, href: "/admin/reviews" },
    { label: "Pending Reviews", value: stats.pendingReviews, href: "/admin/reviews" },
    { label: "Featured Reviews", value: stats.featuredReviews, href: "/admin/reviews" },
    {
      label: "Average Rating",
      value: stats.averageRating ?? "—",
      href: "/admin/reviews"
    },
    { label: "Reader Photos", value: stats.totalPhotos, href: "/admin/gallery" },
    { label: "Pending Photos", value: stats.pendingPhotos, href: "/admin/gallery" },
    {
      label: "Newsletter",
      value: stats.newsletterSubscribers,
      href: "#"
    }
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-bone">Community</h1>
      <p className="mt-2 font-sans text-sm text-ash">
        Imagine de ansamblu asupra comunității Cititorii lui Icarus.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-bone/10 bg-charcoal/30 p-6 transition-colors hover:border-bone/20"
          >
            <p className="font-sans text-[12px] uppercase tracking-wideish text-ash">
              {card.label}
            </p>
            <p className="mt-3 font-serif text-4xl text-bone">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
