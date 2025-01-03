"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginPayload, FormData, FormErrors } from "@/types/types";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // Track redirection state
  const [isLoading, setIsLoading] = useState(false); // Loading spinner

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true); // Show the loading spinner
    setIsRedirecting(true); // Set redirect state before the delay

    try {
      const payload: LoginPayload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage and context
        localStorage.setItem("token", data.token);
        setToken(data.token);

        // Store user data in context
        setUser(data.user);

        toast.success("Successfully logged in!");

        // Set a flag in localStorage to indicate login success
        localStorage.setItem("loginSuccess", "true");
        router.push("/dashboard"); // Redirect to dashboard after successful login

        // Adding a delay before redirect to show "Redirecting..." text
      } else {
        toast.error(
          data.message || "Login failed! Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed! Please try again later.");
    } finally {
      setIsSubmitting(false);
      setIsRedirecting(false); // Reset redirect state
      setIsLoading(false); // Hide the loading spinner
    }
  };

  const isFormValid = !!(formData.email && formData.password);

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");

    if (loginSuccess === "true") {
      localStorage.removeItem("loginSuccess");
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-24 mb-9 ${
        isRedirecting ? "fade-out" : ""
      }`}
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Welcome Back!
      </h2>
      <p className="text-gray-500 text-center mt-2">
        Please login to your account
      </p>

      {/* Google Sign-in Button */}
      <button
        onClick={() => toast.info("Google Sign-in coming soon!")}
        className="flex items-center justify-center w-full bg-gray-100 border border-gray-300 text-gray-600 font-medium px-4 py-2 mt-6 rounded-lg hover:bg-gray-200 transition"
      >
        <svg
          className="h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="25px"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        Sign in with Google
      </button>

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-sm text-gray-400">Or continue with</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Login Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-1 py-3 text-slate-700 text-sm outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Password</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="w-full px-1 py-3 text-slate-700 text-sm outline-none"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="px-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end text-sm">
          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting || isLoading || isRedirecting}
          className={`w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition ${
            !isFormValid || isSubmitting || isLoading || isRedirecting
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isRedirecting ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin border-4 border-t-4 border-white rounded-full w-5 h-5 mr-2"></div>
              Redirecting...
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin border-4 border-t-4 border-white rounded-full w-5 h-5 mr-2"></div>
              Logging in...
            </div>
          ) : isSubmitting ? (
            "Signing in..."
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-sm text-center mt-4 text-gray-500">
        Don't have an account?{" "}
        <Link href="/signup" className="text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
