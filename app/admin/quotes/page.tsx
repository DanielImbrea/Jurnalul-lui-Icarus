import AdminNav from "@/components/admin/AdminNav";
import AdminQuotesPanel from "@/components/admin/AdminQuotesPanel";

export default function AdminQuotesPage() {
  return (
    <>
      <AdminNav />
      <main className="container-editorial py-12">
        <h1 className="font-serif text-3xl text-bone">Quotes</h1>
        <p className="mt-2 font-sans text-sm text-ash">
          Citate din cărți — adaugă, editează, ascunde, featured.
        </p>
        <div className="mt-10">
          <AdminQuotesPanel />
        </div>
      </main>
    </>
  );
}
