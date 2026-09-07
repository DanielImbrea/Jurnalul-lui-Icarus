import AdminNav from "@/components/admin/AdminNav";
import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";

export default function AdminOrdersPage() {
  return (
    <>
      <AdminNav />
      <main className="container-editorial py-12">
        <h1 className="font-serif text-3xl text-bone">Comenzi</h1>
        <p className="mt-2 font-sans text-sm text-ash">
          Toate comenzile — card (Stripe) și ramburs — cu date client și
          adresă de livrare.
        </p>
        <div className="mt-10">
          <AdminOrdersPanel />
        </div>
      </main>
    </>
  );
}
