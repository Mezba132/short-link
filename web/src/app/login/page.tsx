"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { setTokens } from "@/lib/auth";
import { EndPoint } from "@/utility/end-points";

export default function LoginPage() {
  type FormState = {
    email: string;
    password: string;
  };
  const [form, setForm] = useState<FormState>({
    email: "johndoe@mail.com",
    password: "Password123!",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post(EndPoint.SIGN_IN, form);
      if (data.success) {
        setTokens(
          data.data.accessToken,
          data.data.refreshToken,
          data.data.userInfo._id,
          data.data.userInfo.role
        );
        if (data.data.userInfo.role === "user") {
          router.push("/user");
        }
        if (
          data.data.userInfo.role === "admin" ||
          data.data.userInfo.role === "super_admin"
        ) {
          router.push("/admin");
        }
      }
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
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
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
