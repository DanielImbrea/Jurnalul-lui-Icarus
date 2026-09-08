"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { products } from "@/lib/products";
import { fetchAdminJson } from "@/lib/admin-fetch";

type ReviewStatus = "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";

interface Review {
  id: string;
  bookId: string;
  name: string;
  email: string;
  rating: number;
  content: string;
  imageUrl?: string | null;
  socialHandle?: string | null;
  status: ReviewStatus;
  featured: boolean;
  verifiedPurchase: boolean;
  createdAt: string;
}

const statuses: (ReviewStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "APPROVED",
  "HIDDEN",
  "REJECTED"
];

export default function AdminReviewsPanel() {
  const [status, setStatus] = useState<ReviewStatus | "ALL">("PENDING");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Review | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const query = status === "ALL" ? "" : `?status=${status}`;
    const { data, error: fetchError } = await fetchAdminJson<Review[]>(
      `/api/admin/reviews${query}`
    );

    setReviews(Array.isArray(data) ? data : []);
    setError(fetchError);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [status]);

  async function updateReview(id: string, data: Partial<Review>) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    await load();
    setEditing(null);
  }

  async function deleteReview(id: string) {
    if (!confirm("Ștergi definitiv această recenzie?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 font-sans text-[12px] ${
              status === s ? "bg-bone/10 text-bone" : "text-ash hover:text-bone"
            }`}
          >
            {s === "ALL" ? "Toate" : s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 font-sans text-sm text-ash">Se încarcă...</p>
      ) : error ? (
        <p className="mt-10 font-sans text-sm text-wine-light">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="mt-10 font-sans text-sm text-ash">Nicio recenzie.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {reviews.map((review) => {
            const book = products[review.bookId as keyof typeof products];
            const isEditing = editing?.id === review.id;

            return (
              <article
                key={review.id}
                className="border border-bone/10 bg-charcoal/30 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl text-bone">{review.name}</p>
                    <p className="mt-1 font-sans text-[12px] text-ash">
                      {book?.title} · ★ {review.rating} · {review.status}
                      {review.featured && " · FEATURED"}
                      {review.verifiedPurchase && " · VERIFIED"}
                    </p>
                    <p className="mt-1 font-sans text-[12px] text-ash/70">
                      {review.email} · {new Date(review.createdAt).toLocaleString("ro-RO")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {review.status !== "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => updateReview(review.id, { status: "APPROVED" })}
                        className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember"
                      >
                        Approve
                      </button>
                    )}
                    {review.status !== "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => updateReview(review.id, { status: "REJECTED" })}
                        className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                      >
                        Reject
                      </button>
                    )}
                    {review.status !== "HIDDEN" && (
                      <button
                        type="button"
                        onClick={() => updateReview(review.id, { status: "HIDDEN" })}
                        className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                      >
                        Hide
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        updateReview(review.id, { featured: !review.featured })
                      }
                      className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-ember"
                    >
                      {review.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(isEditing ? null : review)}
                      className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReview(review.id)}
                      className="border border-wine/30 px-3 py-1 font-sans text-[11px] text-wine-light"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-4 font-serif text-lg leading-relaxed text-mist">
                  „{review.content}”
                </p>

                {review.imageUrl && (
                  <div className="relative mt-4 h-32 w-32">
                    <Image
                      src={review.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {isEditing && (
                  <form
                    className="mt-6 grid gap-4 border-t border-bone/10 pt-6 md:grid-cols-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      updateReview(review.id, {
                        name: String(fd.get("name")),
                        content: String(fd.get("content")),
                        rating: Number(fd.get("rating")),
                        bookId: String(fd.get("bookId")),
                        verifiedPurchase: fd.get("verifiedPurchase") === "on"
                      });
                    }}
                  >
                    <input
                      name="name"
                      defaultValue={review.name}
                      className="border border-bone/15 bg-ink px-3 py-2 font-sans text-sm text-bone"
                    />
                    <select
                      name="bookId"
                      defaultValue={review.bookId}
                      className="border border-bone/15 bg-ink px-3 py-2 font-sans text-sm text-bone"
                    >
                      <option value="blake">Blake</option>
                      <option value="durere">Durere</option>
                    </select>
                    <input
                      name="rating"
                      type="number"
                      min={1}
                      max={5}
                      defaultValue={review.rating}
                      className="border border-bone/15 bg-ink px-3 py-2 font-sans text-sm text-bone"
                    />
                    <label className="flex items-center gap-2 font-sans text-sm text-ash">
                      <input
                        name="verifiedPurchase"
                        type="checkbox"
                        defaultChecked={review.verifiedPurchase}
                      />
                      Verified Purchase
                    </label>
                    <textarea
                      name="content"
                      rows={4}
                      defaultValue={review.content}
                      className="md:col-span-2 border border-bone/15 bg-ink px-3 py-2 font-sans text-sm text-bone"
                    />
                    <button
                      type="submit"
                      className="md:col-span-2 w-fit bg-bone px-4 py-2 font-sans text-[12px] text-ink"
                    >
                      Salvează
                    </button>
                  </form>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
