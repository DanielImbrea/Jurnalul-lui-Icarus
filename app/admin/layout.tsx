export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-ink text-bone">{children}</div>
  );
}
