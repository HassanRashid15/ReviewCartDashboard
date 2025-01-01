"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Password Validation Criteria
  const validationCriteria = [
    { label: "At least 8 characters long", isValid: password.length >= 8 },
    { label: "Contains uppercase letter", isValid: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", isValid: /[a-z]/.test(password) },
    { label: "Contains number", isValid: /\d/.test(password) },
  ];

  const isFormValid =
    validationCriteria.every((criteria) => criteria.isValid) &&
    password === confirmPassword;

  return (
    <div className="flex items-center justify-center  bg-gray-50 mt-20 mb-5">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Reset Your Password
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Please enter your new password below
        </p>

        {/* New Password Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative mt-1">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 text-sm border rounded-md focus:ring-indigo-500 text-black focus:border-indigo-500"
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative mt-1">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 text-sm border rounded-md text-black focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              aria-label="Toggle confirm password visibility"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            >
              {confirmPasswordVisible ? (
                <FaEyeSlash size={20} />
              ) : (
                <FaEye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-semibold text-gray-700">
            Password Requirements:
          </p>
          <ul className="mt-2 text-sm space-y-1" aria-live="polite">
            {validationCriteria.map((criteria, index) => (
              <li
                key={index}
                className={`flex items-center ${
                  criteria.isValid ? "text-green-600" : "text-gray-700"
                }`}
              >
                <span
                  className={`mr-2 w-2 h-2 rounded-full ${
                    criteria.isValid ? "bg-green-600" : "bg-gray-700"
                  }`}
                ></span>
                {criteria.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Reset Password Button */}
        <button
          disabled={!isFormValid}
          className={`w-full mt-6 py-2 text-sm font-medium text-white rounded-md transition ${
            isFormValid
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Reset Password
        </button>

        {/* Back to Login */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-indigo-500 hover:underline">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
