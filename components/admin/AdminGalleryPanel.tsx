"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { products } from "@/lib/products";
import { fetchAdminJson } from "@/lib/admin-fetch";

type GalleryStatus = "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";

interface GalleryPhoto {
  id: string;
  bookId: string;
  name: string;
  email?: string | null;
  imageUrl: string;
  caption?: string | null;
  status: GalleryStatus;
  featured: boolean;
  createdAt: string;
}

interface ReaderGroup {
  key: string;
  name: string;
  count: number;
}

type StatusCounts = Record<GalleryStatus, number>;

const statuses: (GalleryStatus | "ALL")[] = [
  "PENDING",
  "APPROVED",
  "ALL",
  "HIDDEN",
  "REJECTED"
];

const statusLabels: Record<GalleryStatus | "ALL", string> = {
  ALL: "Toate",
  PENDING: "În așteptare",
  APPROVED: "Publicate",
  HIDDEN: "Ascunse",
  REJECTED: "Respinse"
};

const statusBadgeStyles: Record<GalleryStatus, string> = {
  PENDING: "border-amber-400/40 bg-amber-500/20 text-amber-100",
  APPROVED: "border-emerald-400/40 bg-emerald-500/20 text-emerald-100",
  HIDDEN: "border-bone/25 bg-bone/10 text-ash",
  REJECTED: "border-wine/40 bg-wine/25 text-wine-light"
};

const statusCardStyles: Record<GalleryStatus, string> = {
  PENDING: "border-bone/10",
  APPROVED: "border-emerald-400/30 ring-1 ring-emerald-400/15",
  HIDDEN: "border-bone/10 opacity-90",
  REJECTED: "border-wine/20 opacity-90"
};

function readerKey(name: string) {
  return name.trim().toLowerCase();
}

function countByStatus(photos: GalleryPhoto[]): StatusCounts {
  return photos.reduce<StatusCounts>(
    (acc, photo) => {
      acc[photo.status] += 1;
      return acc;
    },
    { PENDING: 0, APPROVED: 0, HIDDEN: 0, REJECTED: 0 }
  );
}

export default function AdminGalleryPanel() {
  const [status, setStatus] = useState<GalleryStatus | "ALL">("PENDING");
  const [selectedReader, setSelectedReader] = useState<string | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    PENDING: 0,
    APPROVED: 0,
    HIDDEN: 0,
    REJECTED: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const query = status === "ALL" ? "" : `?status=${status}`;

    const [filteredResult, allResult] = await Promise.all([
      fetchAdminJson<GalleryPhoto[]>(`/api/admin/gallery${query}`),
      fetchAdminJson<GalleryPhoto[]>("/api/admin/gallery")
    ]);

    const filteredPhotos = Array.isArray(filteredResult.data)
      ? filteredResult.data
      : [];
    const allPhotos = Array.isArray(allResult.data) ? allResult.data : [];

    setPhotos(filteredPhotos);
    setStatusCounts(countByStatus(allPhotos));
    setError(filteredResult.error ?? allResult.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [status]);

  useEffect(() => {
    setSelectedReader(null);
  }, [status]);

  const readers = useMemo<ReaderGroup[]>(() => {
    const map = new Map<string, ReaderGroup>();

    for (const photo of photos) {
      const key = readerKey(photo.name);
      const existing = map.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { key, name: photo.name.trim(), count: 1 });
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "ro")
    );
  }, [photos]);

  const visiblePhotos = useMemo(() => {
    if (!selectedReader) return photos;
    return photos.filter((photo) => readerKey(photo.name) === selectedReader);
  }, [photos, selectedReader]);

  async function updatePhoto(id: string, data: Partial<GalleryPhoto>) {
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    await load();
  }

  async function deletePhoto(id: string) {
    if (!confirm("Ștergi definitiv această fotografie?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    await load();
  }

  const selectedReaderName =
    readers.find((reader) => reader.key === selectedReader)?.name ?? null;

  const totalCount = Object.values(statusCounts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-64">
        <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-ember">
          Cititori
        </p>
        <div className="mt-3 max-h-[420px] overflow-y-auto rounded-xl border border-bone/10 bg-charcoal/30">
          <button
            type="button"
            onClick={() => setSelectedReader(null)}
            className={`flex w-full items-center justify-between border-b border-bone/10 px-4 py-3 text-left font-sans text-sm transition-colors ${
              selectedReader === null
                ? "bg-bone/10 text-bone"
                : "text-ash hover:bg-bone/5 hover:text-bone"
            }`}
          >
            <span>Toți cititorii</span>
            <span className="text-[11px] text-ash">{photos.length}</span>
          </button>

          {readers.length === 0 ? (
            <p className="px-4 py-5 font-sans text-sm text-ash">Niciun cititor încă.</p>
          ) : (
            readers.map((reader) => (
              <button
                key={reader.key}
                type="button"
                onClick={() => setSelectedReader(reader.key)}
                className={`flex w-full items-center justify-between border-b border-bone/10 px-4 py-3 text-left font-sans text-sm transition-colors last:border-b-0 ${
                  selectedReader === reader.key
                    ? "bg-bone/10 text-bone"
                    : "text-ash hover:bg-bone/5 hover:text-bone"
                }`}
              >
                <span className="truncate pr-3">{reader.name}</span>
                <span className="shrink-0 text-[11px] text-ash">{reader.count}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-sans text-sm text-bone">
              {selectedReaderName
                ? `Fotografiile lui ${selectedReaderName}`
                : status === "APPROVED"
                  ? "Fotografii publicate în galerie"
                  : status === "PENDING"
                    ? "Fotografii de revizuit"
                    : "Toate fotografiile"}
            </p>
            <p className="mt-1 font-sans text-[12px] text-ash">
              {visiblePhotos.length}{" "}
              {visiblePhotos.length === 1 ? "fotografie" : "fotografii"}
              {status === "APPROVED" && " · vizibile pe site"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
              const count =
                s === "ALL" ? totalCount : statusCounts[s as GalleryStatus];

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-lg px-3 py-1.5 font-sans text-[12px] transition-colors ${
                    status === s
                      ? s === "APPROVED"
                        ? "bg-emerald-500/15 text-emerald-100"
                        : s === "PENDING"
                          ? "bg-amber-500/15 text-amber-100"
                          : "bg-bone/10 text-bone"
                      : "text-ash hover:bg-bone/5 hover:text-bone"
                  }`}
                >
                  {statusLabels[s]}
                  {count > 0 && (
                    <span className="ml-1.5 text-[10px] opacity-70">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <p className="mt-10 font-sans text-sm text-ash">Se încarcă...</p>
        ) : error ? (
          <p className="mt-10 font-sans text-sm text-wine-light">{error}</p>
        ) : visiblePhotos.length === 0 ? (
          <p className="mt-10 font-sans text-sm text-ash">
            {selectedReaderName
              ? `${selectedReaderName} nu are fotografii în filtrul curent.`
              : status === "APPROVED"
                ? "Nicio fotografie publicată încă."
                : status === "PENDING"
                  ? "Nicio fotografie în așteptare."
                  : "Nicio fotografie."}
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visiblePhotos.map((photo) => {
              const book = products[photo.bookId as keyof typeof products];

              return (
                <article
                  key={photo.id}
                  className={`overflow-hidden rounded-xl border bg-charcoal/30 ${statusCardStyles[photo.status]}`}
                >
                  <div className="relative aspect-[4/5] bg-charcoal/80">
                    <Image
                      src={photo.imageUrl}
                      alt={`Fotografie de la ${photo.name}`}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] ${statusBadgeStyles[photo.status]}`}
                      >
                        {statusLabels[photo.status]}
                      </span>
                      {photo.featured && photo.status === "APPROVED" && (
                        <span className="rounded-full border border-ember/40 bg-ember/15 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-ember">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-serif text-lg text-bone">{photo.name}</p>
                    <p className="mt-1 font-sans text-[11px] text-ash">
                      {book?.title}
                    </p>
                    {photo.email && (
                      <p className="mt-1 font-sans text-[11px] text-ash/80">
                        {photo.email}
                      </p>
                    )}
                    {photo.caption && (
                      <p className="mt-2 font-sans text-[12px] leading-relaxed text-mist line-clamp-3">
                        {photo.caption}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {photo.status === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => updatePhoto(photo.id, { status: "APPROVED" })}
                          className="rounded border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 font-sans text-[10px] text-emerald-100"
                        >
                          Publică în galerie
                        </button>
                      )}

                      {photo.status === "APPROVED" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updatePhoto(photo.id, {
                                status: "PENDING",
                                featured: false
                              })
                            }
                            className="rounded border border-amber-400/30 bg-amber-500/10 px-2 py-1 font-sans text-[10px] text-amber-100"
                          >
                            Dezaprobă
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updatePhoto(photo.id, { featured: !photo.featured })
                            }
                            className="rounded border border-bone/20 px-2 py-1 font-sans text-[10px] text-ember"
                          >
                            {photo.featured ? "Scoate featured" : "Featured"}
                          </button>
                        </>
                      )}

                      {photo.status !== "HIDDEN" && photo.status !== "REJECTED" && (
                        <button
                          type="button"
                          onClick={() => updatePhoto(photo.id, { status: "HIDDEN" })}
                          className="rounded border border-bone/20 px-2 py-1 font-sans text-[10px] text-ash"
                        >
                          Ascunde
                        </button>
                      )}

                      {photo.status === "HIDDEN" && (
                        <button
                          type="button"
                          onClick={() => updatePhoto(photo.id, { status: "PENDING" })}
                          className="rounded border border-bone/20 px-2 py-1 font-sans text-[10px] text-bone"
                        >
                          Readuce în așteptare
                        </button>
                      )}

                      {photo.status !== "APPROVED" && photo.status !== "REJECTED" && (
                        <button
                          type="button"
                          onClick={() => updatePhoto(photo.id, { status: "REJECTED" })}
                          className="rounded border border-wine/30 px-2 py-1 font-sans text-[10px] text-wine-light"
                        >
                          Respinge
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deletePhoto(photo.id)}
                        className="rounded border border-wine/30 px-2 py-1 font-sans text-[10px] text-wine-light"
                      >
                        Șterge
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
