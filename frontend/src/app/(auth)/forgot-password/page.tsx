"use client"; // Add this directive at the top of the file

import React, { useState } from "react";
import { Mail, Info, Clock, HelpCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

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
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          <form className="mt-5 space-y-6">
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
                  value={email}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!email}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                email
                  ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Send Reset Link
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
    </div>
  );
};

export default ForgotPassword;
