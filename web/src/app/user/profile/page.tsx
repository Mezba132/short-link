"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getUserId, isAuthenticated } from "@/lib/auth";

export default function profile() {
  const [userInfo, setUserInfo] = useState({ _id: "", name: "", email: "" });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      try {
        let userId = getUserId();
        let user = await api.get(`/user/${userId}`);
        console.log("User here", user.data.data);
        setUserInfo(user.data.data);
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded w-80">
        <h1 className="text-2xl font-bold text-center mb-4">User Info</h1>
        <div className="mb-4">
          <p className="text-gray-600 text-sm">ID:</p>
          <p className="text-gray-800 font-semibold">{userInfo._id}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 text-sm">Name:</p>
          <p className="text-gray-800 font-semibold">{userInfo.name}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 text-sm">Email:</p>
          <p className="text-gray-800 font-semibold">{userInfo.email}</p>
        </div>
      </div>
    </div>
  );
}
