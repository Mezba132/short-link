"use client";
import api from "@/lib/api";
import { useState } from "react";

export default function CreateLink() {
  type FormState = {
    originalUrl: string;
    customAlias?: string;
    expiresAt?: string;
  };

  type ResultState = {
    shortenedUrl: string;
  } | null;

  const [form, setForm] = useState<FormState>({
    originalUrl: "",
    customAlias: undefined,
    expiresAt: undefined,
  });
  const [result, setResult] = useState<ResultState>(null);
  const [copySuccess, setCopySuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/link/shorten", form);
      console.log(response);
      setResult({
        shortenedUrl: "http://localhost:5000/api/" + response.data.data.alias,
      });
      setCopySuccess("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (field: string, value: string | undefined) => {
    setForm({ ...form, [field]: value });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopySuccess("Copied to clipboard!"))
      .catch(() => setCopySuccess("Failed to copy."));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded w-2/4">
        <h2 className="text-2xl font-bold mb-4">Create Link</h2>
        <form onSubmit={handleSubmit}>
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
                handleInputChange("customAlias", e.target.value || undefined)
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
                handleInputChange("expiresAt", e.target.value || undefined)
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Create
          </button>
        </form>
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Your Shortened Link</h3>
            <div className="flex items-center justify-between bg-gray-200 p-3 rounded">
              <input
                type="text"
                readOnly
                value={result.shortenedUrl}
                className="bg-transparent text-blue-600 font-semibold w-full outline-none cursor-pointer"
                onClick={() => handleCopy(result.shortenedUrl)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
                onClick={() => handleCopy(result.shortenedUrl)}
              >
                Copy
              </button>
            </div>
            {copySuccess && (
              <p className="text-green-500 text-sm mt-2">{copySuccess}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
