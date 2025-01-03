"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Get page specific content
  const getAuthContent = () => {
    switch (pathname) {
      case "/login":
        return {
          title: "Welcome Back!",
          description: "Sign in to continue to your account",
          image: "/login.png",
        };
      case "/signup":
        return {
          title: "Create Account",
          description: "Join our community today",
          image: "/signup.jpg",
        };
      case "/verify-email":
        return {
          title: "Verify Email",
          description: "Please verify your email address",
          image: "",
        };
      case "/forgot-password":
        return {
          title: "Reset Password",
          description: "Get back into your account",
          image: "/password.png",
        };
      default:
        return {
          title: "Authentication",
          description: "Secure access to your account",
          image: "/api/placeholder/1000/1000",
        };
    }
  };

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

  const content = getAuthContent();

  // If no user and not loading, show auth pages with split layout
  return (
    <div className={`${geistSans.variable} min-h-screen flex flex-row`}>
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-indigo-600 opacity-20"></div>
        <img
          src={content.image}
          alt="Authentication background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
            <p className="text-xl">{content.description}</p>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
