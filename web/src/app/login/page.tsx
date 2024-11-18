"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { setTokens } from "@/lib/auth";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "johndoe@example.com",
    password: "Password123!",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      if (data.success) {
        setTokens(
          data.data.accessToken,
          data.data.refreshToken,
          data.data.userInfo._id
        );
      }
      router.push("/user");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuestLogin = () => {
    router.push("/guest");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 mb-4 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 mb-4 w-full"
          required
        />
        <p
          className="text-sm p-2 text-blue-500 cursor-pointer"
          onClick={handleGuestLogin}
        >
          Guest User
        </p>
        <p className="text-sm p-2 mb-4">
          Don't have an account?{" "}
          <span
            className=" text-blue-500 cursor-pointer"
            onClick={() => {
              router.push("/register");
            }}
          >
            Sign Up
          </span>
        </p>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
