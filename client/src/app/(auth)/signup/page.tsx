"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import {
  PasswordStrength,
  FormData,
  FormErrors,
  RegisterPayload,
} from "@/types/types";

const SignUpPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength>("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") checkPasswordStrength(value);
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = "";
    const lengthCriteria = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|`~]/.test(password);

    if (!lengthCriteria) {
      strength = "Password must be at least 8 characters";
    } else if (!hasUpperCase) {
      strength = "Password must contain at least one uppercase letter";
    } else if (!hasLowerCase) {
      strength = "Password must contain at least one lowercase letter";
    } else if (!hasNumber) {
      strength = "Password must contain at least one number";
    } else if (!hasSpecialChar) {
      strength = "Password must contain at least one special character";
    } else if (
      lengthCriteria &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    ) {
      strength = "strong";
    } else if (
      lengthCriteria &&
      (hasUpperCase || hasLowerCase) &&
      (hasNumber || hasSpecialChar)
    ) {
      strength = "medium";
    } else {
      strength = "weak";
    }

    setPasswordStrength(strength);
    return strength;
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    } else if (!/^[A-Za-z\s]{2,}$/.test(formData.firstName)) {
      newErrors.firstName = "Please enter a valid first name";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    } else if (!/^[A-Za-z\s]{2,}$/.test(formData.lastName)) {
      newErrors.lastName = "Please enter a valid last name";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const strength = checkPasswordStrength(formData.password);
      if (strength !== "strong") {
        newErrors.password = strength;
      }
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

    try {
      const payload: RegisterPayload = {
        email: formData.email,
        fullname: {
          firstname: formData.firstName,
          lastname: formData.lastName,
        },
        password: formData.password,
      };

      const response = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          window.location.href = `/verify-email?email=${encodeURIComponent(
            formData.email
          )}`;
        }, 2000);
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during registration"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !!(
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    passwordStrength === "strong" &&
    Object.keys(errors).length === 0
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-24 mb-9">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Create Account
      </h2>
      <p className="text-gray-500 text-center mt-2">Join our community today</p>

      <button
        type="button"
        onClick={() => toast.info("Google Sign-up coming soon!")}
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
        Sign up with Google
      </button>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-sm text-gray-400">Or continue with</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            First Name
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaUser />
            </span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full px-1 py-3 text-slate-700 text-sm outline-none"
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">Last Name</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaUser />
            </span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full px-1 py-3 text-slate-700 text-sm outline-none"
            />
          </div>
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-1 py-3 text-slate-700 text-sm outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">Password</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-1 py-3 text-slate-700 text-sm outline-none"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="px-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div>
            <div className="h-1 w-full bg-gray-200 rounded-full">
              <div
                className={`h-full transition-colors ${
                  passwordStrength === "strong"
                    ? "w-full bg-green-500"
                    : passwordStrength === "medium"
                    ? "w-2/3 bg-yellow-500"
                    : "w-1/3 bg-red-500"
                }`}
              />
            </div>
            <p
              className={`text-xs mt-1 ${
                passwordStrength === "strong"
                  ? "text-green-500"
                  : passwordStrength === "medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {typeof passwordStrength === "string" && passwordStrength}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition ${
            !isFormValid || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>

        {/* Sign in Link */}
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
