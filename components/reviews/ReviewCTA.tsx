import Link from "next/link";
import type { BookId } from "@/lib/validation";

interface ReviewCTAProps {
  bookId: BookId;
}

export default function ReviewCTA({ bookId }: ReviewCTAProps) {
  return (
    <section className="relative overflow-hidden border-t border-bone/10 py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(90,30,42,0.15),transparent_70%)]" />

      <div className="container-editorial relative text-center">
        <p className="font-sans text-[13px] text-ember">Ai citit-o?</p>
        <h2 className="mx-auto mt-5 max-w-xl font-serif text-4xl leading-tight text-bone sm:text-5xl">
          Spune-ne ce a rămas cu tine.
        </h2>
        <p className="mx-auto mt-6 max-w-md font-sans text-[15px] leading-relaxed text-ash">
          Unele cărți se termină odată cu ultima pagină. Altele continuă să te
          însoțească și după ce le-ai închis. Dacă ai citit-o,
          lasă o parte din povestea ta aici.
        </p>

        <Link
          href={`/lasa-o-recenzie?carte=${bookId}`}
          className="btn-secondary mt-10 !px-10 !py-4"
        >
          Lasă o recenzie
        </Link>
      </div>
    </section>
  );
}
