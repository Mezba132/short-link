"use client";
import api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLink() {
  const [form, setForm] = useState({
    originalUrl: "",
    customAlias: undefined,
    expiresAt: undefined,
    isPrivate: false,
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(form);

      await api.post("/link/shorten", form);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = () => {
    setForm({ ...form, isPrivate: !form.isPrivate });
  };

  const handleInputChange = (field: string, value: string | undefined) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-md rounded w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Create Link</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Original Url"
            value={form.originalUrl}
            onChange={(e) => handleInputChange("originalUrl", e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Custom Alias"
            value={form.customAlias || ""}
            onChange={(e) =>
              handleInputChange(
                "customAlias",
                e.target.value || undefined // Ensures undefined when empty
              )
            }
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <input
            id="expiresAt"
            type="datetime-local"
            value={form.expiresAt || ""}
            onChange={(e) =>
              handleInputChange(
                "expiresAt",
                e.target.value || undefined // Ensures undefined when empty
              )
            }
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={form.isPrivate}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isPrivate" className="text-gray-700">
            Private
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Create
        </button>
      </form>
    </div>
  );
}
