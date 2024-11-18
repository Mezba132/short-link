"use client";

import { useEffect } from "react";
import { removeTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    removeTokens();
    router.push("/login");
  }, [router]);

  return null;
}
