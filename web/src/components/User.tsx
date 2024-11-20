"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const User = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-4">User</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/user/create-link">
          <button
            className={`w-full px-4 py-2 text-left ${
              pathname === "/user/create-link" ? "bg-blue-500" : "bg-gray-700"
            } rounded hover:bg-gray-600 transition`}
          >
            Create Link
          </button>
        </Link>
        <Link href="/user/show-link">
          <button
            className={`w-full px-4 py-2 text-left ${
              pathname === "/user/show-link" ? "bg-blue-500" : "bg-gray-700"
            } rounded hover:bg-gray-600 transition`}
          >
            Show Links
          </button>
        </Link>
        <Link href="/user/profile">
          <button
            className={`w-full px-4 py-2 text-left ${
              pathname === "/user/profile" ? "bg-blue-500" : "bg-gray-700"
            } rounded hover:bg-gray-600 transition`}
          >
            Profile
          </button>
        </Link>
        <Link href="/logout">
          <button
            className={`w-full px-4 py-2 text-left ${
              pathname === "/logout" ? "bg-blue-500" : "bg-gray-700"
            } rounded hover:bg-gray-600 transition`}
          >
            Log out
          </button>
        </Link>
      </nav>
    </aside>
  );
};

export default User;
