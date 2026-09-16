import type { ComponentProps } from "react";
import AdminGalleryPanel from "@/components/admin/AdminGalleryPanel";
import { jsonClone } from "@/lib/admin/serialize";
import { getAdminGalleryPhotos } from "@/lib/gallery";

type GalleryPanelProps = ComponentProps<typeof AdminGalleryPanel>;

export default async function AdminGalleryPage() {
  const [pending, all] = await Promise.all([
    getAdminGalleryPhotos("PENDING"),
    getAdminGalleryPhotos()
  ]);

  return (
    <main className="container-editorial py-12">
      <h1 className="font-serif text-3xl text-bone">Galerie cititori</h1>
      <p className="mt-2 font-sans text-sm text-ash">
        Revizuiește fotografiile noi, publică-le în galerie sau dezaprobă-le
        oricând.
      </p>
      <div className="mt-6">
        <AdminGalleryPanel
          initialPhotos={
            jsonClone(pending) as unknown as GalleryPanelProps["initialPhotos"]
          }
          initialAllPhotos={
            jsonClone(all) as unknown as GalleryPanelProps["initialAllPhotos"]
          }
        />
      </div>
    </main>
  );
}
