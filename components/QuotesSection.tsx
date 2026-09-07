import { getFeaturedQuotes } from "@/lib/content";
import { products } from "@/lib/products";

export default async function QuotesSection() {
  const quotes = await getFeaturedQuotes(4);

  if (quotes.length === 0) {
    return null;
  }

  return (
    <section className="relative border-y border-bone/10 py-24">
      <div className="container-editorial">
        <h2 className="max-w-lg font-serif text-3xl leading-tight text-bone sm:text-4xl">
          Câteva lucruri rămân cu tine.
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {quotes.map((quote) => {
            const book = quote.bookId
              ? products[quote.bookId as keyof typeof products]
              : null;

            return (
              <blockquote
                key={quote.id}
                className="border-t border-bone/15 pt-6"
              >
                <p className="font-serif text-xl leading-relaxed text-bone">
                  „{quote.content}”
                </p>
                {(quote.source || book) && (
                  <footer className="mt-4 font-sans text-[13px] text-ash">
                    {quote.source ?? book?.title}
                  </footer>
                )}
              </blockquote>
            );
          })}
        </div>
      </div>
    </section>
  );
}
