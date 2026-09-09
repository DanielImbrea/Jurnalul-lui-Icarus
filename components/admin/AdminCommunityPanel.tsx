"use client";

import { useEffect, useState } from "react";
import { fetchAdminJson } from "@/lib/admin-fetch";

type PostStatus = "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";

interface CommunityPost {
  id: string;
  parentId: string | null;
  name: string;
  email: string | null;
  content: string;
  status: PostStatus;
  isAuthorReply: boolean;
  createdAt: string;
  parent?: {
    id: string;
    name: string;
    content: string;
  } | null;
}

const statuses: (PostStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "APPROVED",
  "HIDDEN",
  "REJECTED"
];

function toDatetimeLocalInput(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AdminCommunityPanel() {
  const [status, setStatus] = useState<PostStatus | "ALL">("PENDING");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [dateEditId, setDateEditId] = useState<string | null>(null);
  const [dateDraft, setDateDraft] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    const query = status === "ALL" ? "" : `?status=${status}`;
    const { data, error: fetchError } = await fetchAdminJson<CommunityPost[]>(
      `/api/admin/community-posts${query}`
    );

    setPosts(Array.isArray(data) ? data : []);
    setError(fetchError);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [status]);

  async function updateStatus(id: string, next: PostStatus) {
    await fetch(`/api/admin/community-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next })
    });
    await load();
  }

  async function deletePost(id: string) {
    if (!confirm("Ștergi definitiv acest mesaj?")) return;
    await fetch(`/api/admin/community-posts/${id}`, { method: "DELETE" });
    await load();
  }

  function startDateEdit(post: CommunityPost) {
    setDateEditId(post.id);
    setDateDraft(toDatetimeLocalInput(post.createdAt));
  }

  async function saveDate(id: string) {
    if (!dateDraft) return;

    const parsed = new Date(dateDraft);
    if (Number.isNaN(parsed.getTime())) {
      alert("Data și ora nu sunt valide.");
      return;
    }

    const res = await fetch(`/api/admin/community-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ createdAt: parsed.toISOString() })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Nu am putut actualiza data.");
      return;
    }

    setDateEditId(null);
    setDateDraft("");
    await load();
  }

  async function sendAuthorReply(postId: string) {
    const content = replyDraft.trim();
    if (!content) return;

    const res = await fetch(`/api/admin/community-posts/${postId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Nu am putut trimite răspunsul.");
      return;
    }

    setReplyDraft("");
    setReplyTarget(null);
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={`px-3 py-1.5 font-sans text-[12px] ${
              status === item ? "bg-bone/10 text-bone" : "text-ash hover:text-bone"
            }`}
          >
            {item === "ALL" ? "Toate" : item}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 font-sans text-sm text-ash">Se încarcă...</p>
      ) : error ? (
        <p className="mt-10 font-sans text-sm text-wine-light">{error}</p>
      ) : posts.length === 0 ? (
        <p className="mt-10 font-sans text-sm text-ash">Niciun mesaj.</p>
      ) : (
        <div className="mt-8 space-y-5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-bone/10 bg-charcoal/30 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-serif text-lg text-bone">{post.name}</p>
                    {post.isAuthorReply && (
                      <span className="rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-sans text-[10px] uppercase text-ember">
                        Autor
                      </span>
                    )}
                    {post.parentId && (
                      <span className="rounded-full border border-bone/15 px-2 py-0.5 font-sans text-[10px] uppercase text-mist">
                        Răspuns
                      </span>
                    )}
                    <span className="rounded-full border border-bone/15 px-2 py-0.5 font-sans text-[10px] uppercase text-mist">
                      {post.status}
                    </span>
                  </div>

                  {post.parent && (
                    <p className="mt-2 font-sans text-[12px] text-ash">
                      În răspuns la {post.parent.name}: „
                      {post.parent.content.slice(0, 100)}
                      {post.parent.content.length > 100 ? "…" : ""}”
                    </p>
                  )}

                  {post.email && (
                    <p className="mt-1 font-sans text-[12px] text-ash">{post.email}</p>
                  )}

                  <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-mist">
                    {post.content}
                  </p>

                  {dateEditId === post.id ? (
                    <div className="mt-3 space-y-2">
                      <label className="block font-sans text-[11px] uppercase tracking-wide text-ash">
                        Data și ora afișate
                        <input
                          type="datetime-local"
                          value={dateDraft}
                          onChange={(e) => setDateDraft(e.target.value)}
                          className="input-field mt-1 font-sans text-sm normal-case tracking-normal"
                        />
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveDate(post.id)}
                          className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember"
                        >
                          Salvează data
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDateEditId(null);
                            setDateDraft("");
                          }}
                          className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash"
                        >
                          Anulează
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 font-sans text-[11px] text-ash/70">
                      {new Date(post.createdAt).toLocaleString("ro-RO")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {dateEditId !== post.id && (
                    <button
                      type="button"
                      onClick={() => startDateEdit(post)}
                      className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                    >
                      Editează data
                    </button>
                  )}
                  {post.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(post.id, "APPROVED")}
                      className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember"
                    >
                      Aprobă
                    </button>
                  )}
                  {post.status !== "HIDDEN" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(post.id, "HIDDEN")}
                      className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                    >
                      Ascunde
                    </button>
                  )}
                  {post.status !== "REJECTED" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(post.id, "REJECTED")}
                      className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                    >
                      Respinge
                    </button>
                  )}
                  {!post.isAuthorReply && (
                    <button
                      type="button"
                      onClick={() =>
                        setReplyTarget(replyTarget === post.id ? null : post.id)
                      }
                      className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-ember hover:border-ember"
                    >
                      Răspunde
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-wine-light"
                  >
                    Șterge
                  </button>
                </div>
              </div>

              {replyTarget === post.id && (
                <div className="mt-5 border-t border-bone/10 pt-5">
                  <p className="font-sans text-[11px] uppercase tracking-wide text-ash">
                    Răspuns public ca Daniel Imbrea
                  </p>
                  <textarea
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    rows={3}
                    className="input-field mt-2 resize-y"
                    placeholder="Scrie răspunsul..."
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => sendAuthorReply(post.id)}
                      className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember"
                    >
                      Publică
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTarget(null);
                        setReplyDraft("");
                      }}
                      className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash"
                    >
                      Anulează
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
