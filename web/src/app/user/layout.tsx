import User from "@/components/User";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <User />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
