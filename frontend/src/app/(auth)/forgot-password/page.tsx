"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Mail, Info, Clock, HelpCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ForgotPasswordFormData,
  ApiResponse,
  ForgotPasswordProps,
} from "@/types/types";

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  redirectUrl = "/reset-password",
  apiEndpoint = "http://localhost:4000/users/forgot-password",
}) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [isClient, setIsClient] = useState<boolean>(false); // Flag to ensure client-side rendering
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false); // Flag for token validity
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state to prevent double submission

  // Access URL query parameters after component is mounted
  useEffect(() => {
    setIsClient(true); // Mark as mounted on client
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const loginUrlPara = urlParams.get("loginUrlPara");
      if (loginUrlPara) {
        setIsTokenValid(true); // Mark token as valid if it's available in the query
      }
    }
  }, [isClient]);

  // Handle input changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Handle form submission
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (isLoading) return; // Prevent multiple submissions while loading
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        toast.success("Reset link sent to your email!");

        // Redirect to home page after successful submission
        setTimeout(() => {
          window.location.href = "/"; // Redirect to the home page
        }, 1500); // 1.5 seconds delay to allow the toast to be displayed
      } else {
        toast.error(data.message || "An error occurred, please try again.");
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state after request completes
    }
  };

  // Do not render the page until the component is mounted on the client side
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 mt-24 mb-9">
      <div className="w-full max-w-md space-y-8">
        {/* Main Card */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Forgot Password?
            </h2>
            <p className="mt-2 text-gray-600">
              {isTokenValid
                ? "Enter your email address and we'll send you a link to reset your password."
                : "Please enter your email address to receive a reset link."}
            </p>
          </div>

          <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.email || isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                formData.email && !isLoading
                  ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Remember your password? </span>
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to login
            </a>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Make sure to check your spam folder if you don't see the email
                in your inbox.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                The reset link will expire after 1 hour for security reasons.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Still having trouble?{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
