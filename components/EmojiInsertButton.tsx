"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { EmojiClickData } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EmojiInsertButtonProps {
  onInsert: (emoji: string) => void;
  className?: string;
}

export function insertAtTextareaCursor(
  textarea: HTMLTextAreaElement | null,
  value: string,
  insertion: string,
  onChange: (next: string) => void
) {
  if (!textarea) {
    onChange(value + insertion);
    return;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const next = value.slice(0, start) + insertion + value.slice(end);
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    const cursor = start + insertion.length;
    textarea.setSelectionRange(cursor, cursor);
  });
}

export default function EmojiInsertButton({
  onInsert,
  className = ""
}: EmojiInsertButtonProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handlePick(data: EmojiClickData) {
    onInsert(data.emoji);
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Adaugă emoji"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex size-9 items-center justify-center rounded-lg border border-bone/15 bg-charcoal/60 text-lg text-bone transition hover:border-ember/40 hover:bg-charcoal"
      >
        <span aria-hidden>😊</span>
      </button>

      {open && (
        <div className="absolute bottom-full right-0 z-50 mb-2 w-[min(100vw-2rem,360px)] overflow-hidden rounded-xl border border-bone/10 shadow-2xl">
          <EmojiPicker
            onEmojiClick={handlePick}
            theme="dark"
            searchPlaceholder="Caută emoji..."
            width="100%"
            height={380}
            lazyLoadEmojis
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
}
