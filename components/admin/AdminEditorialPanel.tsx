"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EditorialPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  featured: boolean;
  publishedAt?: string | null;
}

export default function AdminEditorialPanel() {
  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    const res = await fetch("/api/admin/editorial");
    setPosts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/editorial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        status: "DRAFT"
      })
    });
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    await load();
  }

  async function updatePost(id: string, data: Partial<EditorialPost>) {
    await fetch(`/api/admin/editorial/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    await load();
  }

  async function deletePost(id: string) {
    if (!confirm("Ștergi articolul?")) return;
    await fetch(`/api/admin/editorial/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <form onSubmit={createPost} className="border border-bone/10 bg-charcoal/30 p-6 space-y-4">
        <h2 className="font-serif text-xl text-bone">Articol nou</h2>
        <input
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) {
              setSlug(
                e.target.value
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")
              );
            }
          }}
          placeholder="Titlu"
          className="w-full border border-bone/15 bg-ink px-4 py-3 font-sans text-sm text-bone"
        />
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-articol"
          className="w-full border border-bone/15 bg-ink px-4 py-3 font-sans text-sm text-bone"
        />
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Extras scurt"
          className="w-full border border-bone/15 bg-ink px-4 py-3 font-sans text-sm text-bone"
        />
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="Conținut..."
          className="w-full border border-bone/15 bg-ink px-4 py-3 font-sans text-sm text-bone"
        />
        <button type="submit" className="bg-bone px-6 py-2 font-sans text-[12px] text-ink">
          Salvează draft
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-wrap items-center justify-between gap-4 border border-bone/10 bg-charcoal/20 p-5"
          >
            <div>
              <p className="font-serif text-lg text-bone">{post.title}</p>
              <p className="mt-1 font-sans text-[12px] text-ash">
                /din-universul-lui-icarus/{post.slug} · {post.status}
                {post.featured && " · FEATURED"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.status !== "PUBLISHED" && (
                <button
                  type="button"
                  onClick={() => updatePost(post.id, { status: "PUBLISHED" })}
                  className="border border-bone/20 px-2 py-1 font-sans text-[10px] text-bone"
                >
                  Publish
                </button>
              )}
              {post.status === "PUBLISHED" && (
                <Link
                  href={`/din-universul-lui-icarus/${post.slug}`}
                  className="border border-bone/20 px-2 py-1 font-sans text-[10px] text-bone"
                >
                  Vezi
                </Link>
              )}
              <button
                type="button"
                onClick={() => deletePost(post.id)}
                className="border border-wine/30 px-2 py-1 font-sans text-[10px] text-wine-light"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
