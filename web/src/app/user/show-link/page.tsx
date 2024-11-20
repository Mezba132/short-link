"use client";
import api from "@/lib/api";
import { getUserId, isAuthenticated } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ShowLink() {
  const router = useRouter();
  const [linkData, setLinkData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        if (!isAuthenticated()) {
          router.push("/login");
          return;
        }

        const userId = getUserId();
        if (!userId) {
          setError("User is not authenticated.");
          router.push("/login");
          return;
        }

        const response = await api.get(`link/user/${userId}`);
        if (response?.data?.success) {
          console.log(response.data);
          setLinkData(response.data.data || []);
          setError(null);
        } else {
          setError(response?.data?.message || "Failed to fetch links.");
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Links not found.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
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
      {linkData.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Original URL</th>
              <th className="border border-gray-300 px-4 py-2">Alias</th>
              <th className="border border-gray-300 px-4 py-2">Custom Alias</th>
              <th className="border border-gray-300 px-4 py-2">Expires At</th>
              <th className="border border-gray-300 px-4 py-2">Is Private</th>
            </tr>
          </thead>
          <tbody>
            {linkData.map((link: any, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {link.originalUrl}
                </td>
                <td
                  className="border border-gray-300 px-4 py-2 cursor-pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "http://localhost:5000/api/" + link.alias || ""
                    )
                  }
                  title="Click to copy"
                >
                  http://localhost:5000/api/{link.alias}
                </td>
                <td
                  className="border border-gray-300 px-4 py-2 cursor-pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "http://localhost:5000/api/" + link.customAlias || ""
                    )
                  }
                  title="Click to copy"
                >
                  {link.customAlias &&
                    `http://localhost:5000/api/${link.customAlias}`}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(link.expiresAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {link.isPrivate ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700">No links found.</p>
      )}
    </div>
  );
}
