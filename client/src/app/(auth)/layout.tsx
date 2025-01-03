"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // If user exists or loading, show nothing
  if (isLoading || user) {
    return null;
  }

  // If no user and not loading, show auth pages
  return <>{children}</>;
}
