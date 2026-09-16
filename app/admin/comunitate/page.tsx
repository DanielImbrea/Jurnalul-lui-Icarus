import type { ComponentProps } from "react";
import AdminCommunityPanel from "@/components/admin/AdminCommunityPanel";
import { jsonClone } from "@/lib/admin/serialize";
import { getAdminCommunityPosts } from "@/lib/community-posts";

type InitialPosts = ComponentProps<
  typeof AdminCommunityPanel
>["initialPosts"];

export default async function AdminCommunityPage() {
  const initialPosts = jsonClone(
    await getAdminCommunityPosts("PENDING")
  ) as unknown as InitialPosts;

  return (
    <main className="container-editorial py-12">
      <h1 className="font-serif text-3xl text-bone">Mesaje comunitate</h1>
      <p className="mt-2 font-sans text-sm text-ash">
        Moderare mesaje, aprobare, răspunsuri publice ca Daniel Imbrea.
      </p>
      <div className="mt-10">
        <AdminCommunityPanel initialPosts={initialPosts} />
      </div>
    </main>
  );
}
