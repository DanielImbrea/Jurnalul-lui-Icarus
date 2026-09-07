import AdminNav from "@/components/admin/AdminNav";
import AdminReviewsPanel from "@/components/admin/AdminReviewsPanel";

export default function AdminReviewsPage() {
  return (
    <>
      <AdminNav />
      <main className="container-editorial py-12">
        <h1 className="font-serif text-3xl text-bone">Reviews</h1>
        <p className="mt-2 font-sans text-sm text-ash">
          Moderare recenzii — Pending, Approved, Hidden, Rejected, Featured.
        </p>
        <div className="mt-10">
          <AdminReviewsPanel />
        </div>
      </main>
    </>
  );
}
