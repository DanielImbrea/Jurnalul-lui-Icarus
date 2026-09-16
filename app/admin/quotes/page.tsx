import type { ComponentProps } from "react";
import AdminQuotesPanel from "@/components/admin/AdminQuotesPanel";
import { jsonClone } from "@/lib/admin/serialize";
import { getAdminQuotes } from "@/lib/content";

type InitialQuotes = ComponentProps<typeof AdminQuotesPanel>["initialQuotes"];

export default async function AdminQuotesPage() {
  const initialQuotes = jsonClone(
    await getAdminQuotes()
  ) as unknown as InitialQuotes;

  return (
    <main className="container-editorial py-12">
      <h1 className="font-serif text-3xl text-bone">Quotes</h1>
      <p className="mt-2 font-sans text-sm text-ash">
        Citate din cărți — adaugă, editează, ascunde, featured.
      </p>
      <div className="mt-10">
        <AdminQuotesPanel initialQuotes={initialQuotes} />
      </div>
    </main>
  );
}
