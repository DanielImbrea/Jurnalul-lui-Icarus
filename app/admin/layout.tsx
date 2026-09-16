import AdminNav from "@/components/admin/AdminNav";
import { getAdminStats } from "@/lib/admin/stats";
import { verifyAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    return (
      <div className="relative min-h-screen bg-ink text-bone">{children}</div>
    );
  }

  const stats = await getAdminStats();

  return (
    <div className="relative min-h-screen bg-ink text-bone">
      <AdminNav
        initialPending={{
          pendingReviews: stats.pendingReviews,
          pendingPhotos: stats.pendingPhotos,
          pendingOrders: stats.pendingOrders,
          pendingCommunityPosts: stats.pendingCommunityPosts
        }}
      />
      {children}
    </div>
  );
}
