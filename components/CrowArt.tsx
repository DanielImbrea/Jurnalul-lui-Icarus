import Image from "next/image";

/** Cioara pe butonul „Descoperă cărțile” */
export function CrowPerchedButton({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/crows/crow-perched.png"
      alt=""
      width={200}
      height={200}
      className={`crow-perched h-full w-full object-contain ${className}`}
      aria-hidden
    />
  );
}
