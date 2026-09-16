import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAdminStats } from "@/lib/admin/stats";

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <main className="container-editorial py-12">
      <AdminDashboard initialStats={stats} />
    </main>
  );
}
