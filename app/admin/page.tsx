import AdminNav from "@/components/admin/AdminNav";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <>
      <AdminNav />
      <main className="container-editorial py-12">
        <AdminDashboard />
      </main>
    </>
  );
}
