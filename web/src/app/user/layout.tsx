import User from "@/components/User";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <User />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default UserLayout;
