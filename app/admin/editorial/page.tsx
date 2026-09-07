import AdminNav from "@/components/admin/AdminNav";
import AdminEditorialPanel from "@/components/admin/AdminEditorialPanel";

export default function AdminEditorialPage() {
  return (
    <>
      <AdminNav />
      <main className="container-editorial py-12">
        <h1 className="font-serif text-3xl text-bone">Din universul lui Icarus</h1>
        <p className="mt-2 font-sans text-sm text-ash">
          Conținut editorial controlat — fragmente, gânduri, noutăți.
        </p>
        <div className="mt-10">
          <AdminEditorialPanel />
        </div>
      </main>
    </>
  );
}
