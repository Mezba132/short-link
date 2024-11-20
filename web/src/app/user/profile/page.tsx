"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getUserId, isAuthenticated } from "@/lib/auth";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({ _id: "", name: "", email: "" });
  const router = useRouter();

  const checkAuth = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
  };

  const fetchUser = async () => {
    let user = getUserId();
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      let response = await api.get(`user/${user}`);
      if (response?.data?.success) {
        setUserInfo(response.data.data);
      }
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  };

  useEffect(() => {
    checkAuth();
    fetchUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white shadow-md rounded w-2/4">
        <h1 className="text-2xl font-bold text-center mb-4">User Info</h1>
        <div className="mb-4 flex justify-between">
          <p className="text-gray-600 text-sm">ID:</p>
          <p className="text-gray-800 font-semibold">{userInfo._id}</p>
        </div>
        <div className="mb-4 flex justify-between">
          <p className="text-gray-600 text-sm">Name:</p>
          <p className="text-gray-800 font-semibold">{userInfo.name}</p>
        </div>
        <div className="mb-4 flex justify-between">
          <p className="text-gray-600 text-sm">Email:</p>
          <p className="text-gray-800 font-semibold">{userInfo.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
