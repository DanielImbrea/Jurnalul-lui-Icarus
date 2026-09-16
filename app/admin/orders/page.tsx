import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";
import { getSerializedAdminOrders } from "@/lib/admin/orders";

export default async function AdminOrdersPage() {
  const initialOrders = await getSerializedAdminOrders();

  return (
    <main className="container-editorial py-12">
      <h1 className="font-serif text-3xl text-bone">Comenzi</h1>
      <p className="mt-2 font-sans text-sm text-ash">
        Toate comenzile — card (Stripe) și ramburs — cu date client și adresă de
        livrare.
      </p>
      <div className="mt-10">
        <AdminOrdersPanel initialOrders={initialOrders} />
      </div>
    </main>
  );
}
