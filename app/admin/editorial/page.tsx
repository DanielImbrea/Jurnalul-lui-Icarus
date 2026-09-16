import type { ComponentProps } from "react";
import AdminEditorialPanel from "@/components/admin/AdminEditorialPanel";
import { jsonClone } from "@/lib/admin/serialize";
import { getAdminEditorialPosts } from "@/lib/content";

type InitialPosts = ComponentProps<typeof AdminEditorialPanel>["initialPosts"];

export default async function AdminEditorialPage() {
  const initialPosts = jsonClone(
    await getAdminEditorialPosts()
  ) as unknown as InitialPosts;

  return (
    <main className="container-editorial py-12">
      <h1 className="font-serif text-3xl text-bone">Din universul lui Icarus</h1>
      <p className="mt-2 font-sans text-sm text-ash">
        Conținut editorial controlat — fragmente, gânduri, noutăți.
      </p>
      <div className="mt-10">
        <AdminEditorialPanel initialPosts={initialPosts} />
      </div>
    </main>
  );
}
