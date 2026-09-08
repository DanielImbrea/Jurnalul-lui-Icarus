import AdminNav from "@/components/admin/AdminNav";
import AdminCommunityPanel from "@/components/admin/AdminCommunityPanel";

export default function AdminCommunityPage() {
  return (
    <>
      <AdminNav />
      <main className="container-editorial py-12">
        <h1 className="font-serif text-3xl text-bone">Mesaje comunitate</h1>
        <p className="mt-2 font-sans text-sm text-ash">
          Moderare mesaje, aprobare, răspunsuri publice ca Daniel Imbrea.
        </p>
        <div className="mt-10">
          <AdminCommunityPanel />
        </div>
      </main>
    </>
  );
}
