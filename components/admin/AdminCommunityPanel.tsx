"use client";

import { useEffect, useRef, useState } from "react";
import EmojiInsertButton, {
  insertAtTextareaCursor,
} from "@/components/EmojiInsertButton";
import { fetchAdminJson } from "@/lib/admin-fetch";
import { isAuthorCommunityPost } from "@/lib/community-posts";

type PostStatus = "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";

interface CommunityPost {
  id: string;
  parentId: string | null;
  name: string;
  email: string | null;
  emailConsentGiven: boolean;
  emailApproved: boolean;
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
  "REJECTED",
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
  const [nameEditId, setNameEditId] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [contentEditId, setContentEditId] = useState<string | null>(null);
  const [contentDraft, setContentDraft] = useState("");
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function clearEdits() {
    setNameEditId(null);
    setNameDraft("");
    setDateEditId(null);
    setDateDraft("");
    setContentEditId(null);
    setContentDraft("");
  }

  async function load() {
    setLoading(true);
    setError(null);
    const query = status === "ALL" ? "" : `?status=${status}`;
    const { data, error: fetchError } = await fetchAdminJson<CommunityPost[]>(
      `/api/admin/community-posts${query}`,
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
      body: JSON.stringify({ status: next }),
    });
    await load();
  }

  async function updateEmailApproved(id: string, emailApproved: boolean) {
    const res = await fetch(`/api/admin/community-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailApproved }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? "Nu am putut actualiza emailul.");
      return;
    }

    await load();
  }

  async function deletePost(id: string) {
    if (!confirm("Ștergi definitiv acest mesaj?")) return;
    await fetch(`/api/admin/community-posts/${id}`, { method: "DELETE" });
    await load();
  }

  function startDateEdit(post: CommunityPost) {
    clearEdits();
    setDateEditId(post.id);
    setDateDraft(toDatetimeLocalInput(post.createdAt));
  }

  function startNameEdit(post: CommunityPost) {
    clearEdits();
    setNameEditId(post.id);
    setNameDraft(post.name);
  }

  function startContentEdit(post: CommunityPost) {
    clearEdits();
    setContentEditId(post.id);
    setContentDraft(post.content);
  }

  async function saveName(id: string) {
    const trimmed = nameDraft.trim();
    if (trimmed.length < 2) {
      alert("Numele trebuie să aibă cel puțin 2 caractere.");
      return;
    }

    const res = await fetch(`/api/admin/community-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Nu am putut actualiza numele.");
      return;
    }

    clearEdits();
    await load();
  }

  async function saveContent(id: string) {
    const trimmed = contentDraft.trim();
    if (trimmed.length < 2) {
      alert("Mesajul trebuie să aibă cel puțin 2 caractere.");
      return;
    }

    const res = await fetch(`/api/admin/community-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmed }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Nu am putut actualiza mesajul.");
      return;
    }

    clearEdits();
    await load();
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
      body: JSON.stringify({ createdAt: parsed.toISOString() }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Nu am putut actualiza data.");
      return;
    }

    clearEdits();
    await load();
  }

  async function sendAuthorReply(postId: string) {
    const content = replyDraft.trim();
    if (!content) return;

    const res = await fetch(`/api/admin/community-posts/${postId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
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
              status === item
                ? "bg-bone/10 text-bone"
                : "text-ash hover:text-bone"
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
                    {nameEditId === post.id ? (
                      <div className="flex w-full max-w-sm flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={nameDraft}
                          onChange={(e) => setNameDraft(e.target.value)}
                          maxLength={80}
                          className="input-field min-w-[180px] flex-1 font-serif text-lg"
                        />
                        <button
                          type="button"
                          onClick={() => saveName(post.id)}
                          className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember"
                        >
                          Salvează
                        </button>
                        <button
                          type="button"
                          onClick={clearEdits}
                          className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash"
                        >
                          Anulează
                        </button>
                      </div>
                    ) : (
                      <p className="font-serif text-lg text-bone">
                        {post.name}
                      </p>
                    )}
                    {isAuthorCommunityPost(post) && (
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
                    <div className="mt-2 space-y-1">
                      <p className="font-sans text-[12px] text-ash">
                        Email (moderare):{" "}
                        <span className="text-mist">{post.email}</span>
                      </p>
                      <p className="font-sans text-[11px] text-ash/80">
                        {post.emailApproved
                          ? "Email aprobat pentru afișare publică."
                          : post.emailConsentGiven
                            ? "Cititorul a acceptat publicarea emailului — așteaptă aprobarea ta."
                            : "Email doar pentru moderare (cititorul nu l-a bifat pentru public)."}
                      </p>
                    </div>
                  )}

                  {contentEditId === post.id ? (
                    <div className="relative mt-3">
                      <textarea
                        ref={contentRef}
                        value={contentDraft}
                        onChange={(e) => setContentDraft(e.target.value)}
                        rows={5}
                        maxLength={3000}
                        className="input-field resize-y pr-12 font-sans text-sm leading-relaxed"
                      />
                      <EmojiInsertButton
                        className="absolute bottom-3 right-3"
                        onInsert={(emoji) =>
                          insertAtTextareaCursor(
                            contentRef.current,
                            contentDraft,
                            emoji,
                            setContentDraft,
                          )
                        }
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveContent(post.id)}
                          className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember"
                        >
                          Salvează mesajul
                        </button>
                        <button
                          type="button"
                          onClick={clearEdits}
                          className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash"
                        >
                          Anulează
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-mist">
                      {post.content}
                    </p>
                  )}

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
                          onClick={clearEdits}
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
                  {nameEditId !== post.id && (
                    <button
                      type="button"
                      onClick={() => startNameEdit(post)}
                      className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                    >
                      Editează numele
                    </button>
                  )}
                  {contentEditId !== post.id && (
                    <button
                      type="button"
                      onClick={() => startContentEdit(post)}
                      className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                    >
                      Editează mesajul
                    </button>
                  )}
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
                      Aprobă mesaj
                    </button>
                  )}
                  {post.status === "APPROVED" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(post.id, "PENDING")}
                      className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                    >
                      Retrage mesaj
                    </button>
                  )}
                  {post.email &&
                    post.emailConsentGiven &&
                    !post.emailApproved && (
                      <button
                        type="button"
                        onClick={() => updateEmailApproved(post.id, true)}
                        className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember"
                      >
                        Aprobă email
                      </button>
                    )}
                  {post.email && post.emailApproved && (
                    <button
                      type="button"
                      onClick={() => updateEmailApproved(post.id, false)}
                      className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                    >
                      Retrage email public
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
                  <div className="relative mt-2">
                    <textarea
                      ref={replyRef}
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      rows={3}
                      className="input-field resize-y pr-12"
                      placeholder="Scrie răspunsul..."
                    />
                    <EmojiInsertButton
                      className="absolute bottom-3 right-3"
                      onInsert={(emoji) =>
                        insertAtTextareaCursor(
                          replyRef.current,
                          replyDraft,
                          emoji,
                          setReplyDraft,
                        )
                      }
                    />
                  </div>
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
