"use client";

import { useState } from "react";
import type { CommunityPostPublic } from "@/lib/community-posts";
import CommunityPostForm from "./CommunityPostForm";

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function PostBubble({
  post,
  nested = false
}: {
  post: CommunityPostPublic;
  nested?: boolean;
}) {
  return (
    <article
      className={`rounded-xl border p-5 ${
        post.isAuthorReply
          ? "border-ember/25 bg-ember/5"
          : nested
            ? "border-bone/10 bg-charcoal/20"
            : "border-bone/10 bg-charcoal/30"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-serif text-lg text-bone">{post.name}</p>
        {post.isAuthorReply && (
          <span className="rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide text-ember">
            Autor
          </span>
        )}
        <span className="font-sans text-[11px] text-ash">
          {formatDate(post.createdAt)}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-mist">
        {post.content}
      </p>
    </article>
  );
}

function ThreadCard({ thread }: { thread: CommunityPostPublic }) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="space-y-4">
      <PostBubble post={thread} />

      {thread.replies.length > 0 && (
        <div className="ml-4 space-y-3 border-l border-bone/10 pl-4 sm:ml-6 sm:pl-6">
          {thread.replies.map((reply) => (
            <PostBubble key={reply.id} post={reply} nested />
          ))}
        </div>
      )}

      <div className="ml-4 sm:ml-6">
        {!showReply ? (
          <button
            type="button"
            onClick={() => setShowReply(true)}
            className="font-sans text-[12px] text-ash underline decoration-bone/20 underline-offset-4 transition-colors hover:text-ember"
          >
            Răspunde
          </button>
        ) : (
          <CommunityPostForm
            parentId={thread.id}
            compact
            onSuccess={() => setShowReply(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function CommunityThreadList({
  threads
}: {
  threads: CommunityPostPublic[];
}) {
  if (threads.length === 0) {
    return (
      <p className="font-sans text-sm leading-relaxed text-ash">
        Încă nu sunt mesaje publicate. Poți fi primul care lasă ceva aici — un
        gând, o întrebare, o stare pe care ai simțit nevoia s-o pui în cuvinte.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  );
}
