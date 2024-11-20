import Admin from "@/components/Admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Admin />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
