"use client"; // Add this directive at the top of the file

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const ResetPassword = ({ token }) => {
  // Pass token as prop, if required by the backend
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  // Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Send POST request to backend API
      const response = await fetch("http://localhost:4000/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token, // Include token if required for password reset
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password successfully reset. You can now log in.");
        toast.success("Password successfully reset. You can now log in.");
      } else {
        setMessage(
          data.message || "Failed to reset password. Please try again."
        );
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    console.log("Password:", value); // Log the password
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    console.log("Confirm Password:", value); // Log the confirm password
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 mt-20 mb-5">
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
              onChange={handlePasswordChange} // Handle password input change
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
              onChange={handleConfirmPasswordChange} // Handle confirm password input change
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
          disabled={!isFormValid || loading}
          onClick={handleSubmit}
          className={`w-full mt-6 py-2 text-sm font-medium text-white rounded-md transition ${
            isFormValid && !loading
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Message after submission */}
        {message && (
          <p
            className={`mt-4 text-sm text-center ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Back to Login */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-indigo-500 hover:underline">
            Back to login
          </a>
        </p>
      </div>
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
};

export default ResetPassword;
