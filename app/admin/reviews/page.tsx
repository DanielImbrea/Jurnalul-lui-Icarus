import type { ComponentProps } from "react";
import AdminReviewsPanel from "@/components/admin/AdminReviewsPanel";
import { jsonClone } from "@/lib/admin/serialize";
import { getAdminReviews } from "@/lib/reviews";

type InitialReviews = ComponentProps<
  typeof AdminReviewsPanel
>["initialReviews"];

export default async function AdminReviewsPage() {
  const initialReviews = jsonClone(
    await getAdminReviews("PENDING")
  ) as unknown as InitialReviews;

  return (
    <main className="container-editorial py-12">
      <h1 className="font-serif text-3xl text-bone">Reviews</h1>
      <p className="mt-2 font-sans text-sm text-ash">
        Moderare recenzii — Pending, Approved, Hidden, Rejected, Featured.
      </p>
      <div className="mt-10">
        <AdminReviewsPanel initialReviews={initialReviews} />
      </div>
    </main>
  );
}
