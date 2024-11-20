"use client";
import api from "@/lib/api";
import { getUserId, getUserRole, isAuthenticated } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EndPoint } from "@/utility/end-points";

export default function User() {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    let role = getUserRole();
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    if (role !== "admin" && role !== "super_admin") {
      router.push("/");
      return;
    }
    let user = getUserId();
    if (!user) {
      router.push("/login");
      return;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get(EndPoint.ALL_USERS);
      if (response?.data?.success) {
        setUserData(response.data.data || []);
        setError(null);
      } else {
        setError(response?.data?.message || "Failed to fetch users.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("users not found.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchUsers();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
        <p className="mb-4 text-center text-gray-700">{error}</p>
        <button
          onClick={() => router.refresh()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Link Details</h1>
      {userData.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user: any, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700">No users found.</p>
      )}
    </div>
  );
}
