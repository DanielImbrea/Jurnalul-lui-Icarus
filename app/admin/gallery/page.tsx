import AdminNav from "@/components/admin/AdminNav";
import AdminGalleryPanel from "@/components/admin/AdminGalleryPanel";

export default function AdminGalleryPage() {
  return (
    <>
      <AdminNav />
      <main className="container-editorial py-12">
        <h1 className="font-serif text-3xl text-bone">Galerie cititori</h1>
        <p className="mt-2 font-sans text-sm text-ash">
          Revizuiește fotografiile noi, publică-le în galerie sau dezaprobă-le oricând.
        </p>
        <div className="mt-6">
          <AdminGalleryPanel />
        </div>
      </main>
    </>
  );
}
