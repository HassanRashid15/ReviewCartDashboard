"use client"; // Add this directive at the top of the file

import React, { useState } from "react";
import Link from "next/link"; // Import Next.js Link
import { FaEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Cookies from "js-cookie"; // Import js-cookie to handle cookies

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Check if both fields are filled and the checkbox is checked
  const isFormValid = email && password && rememberMe;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      const userData = {
        email: email,
        password: password,
      };

      try {
        const response = await fetch("http://localhost:4000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const data = await response.json(); // Assuming the response is JSON
          toast.success("Successfully logged in!");

          // Store the token and userId in cookies for 7 days
          Cookies.set("authToken", data.token, { expires: 7 });
          Cookies.set("userId", data.userId, { expires: 7 }); // Assuming data contains userId

          // Store the token and userId in session storage for the current session
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("userId", data.userId);

          // Optionally, store the email if you need it in session storage and cookies as well
          Cookies.set("userEmail", email, { expires: 7 });
          sessionStorage.setItem("userEmail", email);

          // Redirect the user to a protected page or homepage (optional)
          // window.location.href = '/dashboard'; // Or use Next.js routing with `useRouter`
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.message || "Login failed! Please check your credentials."
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed! Please try again later.");
      }
    } else {
      toast.error("Please fill in all fields and check 'Remember me'");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-24 mb-9">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Welcome Back!
      </h2>
      <p className="text-gray-500 text-center mt-2">
        Please login to your account
      </p>
      <button className="flex items-center justify-center w-full bg-gray-100 border border-gray-300 text-gray-600 font-medium px-4 py-2 mt-6 rounded-lg hover:bg-gray-200 transition">
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
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-sm text-gray-400">Or continue with</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-600">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaEnvelope />
            </span>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-1 py-3 text-slate-700 text-sm outline-none"
              value={email}
              onChange={handleEmailChange} // Handle email input change
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-500">
              <FaLock />
            </span>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-1 py-3 text-slate-700 text-sm outline-none"
              value={password}
              onChange={handlePasswordChange} // Handle password input change
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring focus:ring-indigo-500"
              checked={rememberMe}
              onChange={handleRememberMeChange} // Handle rememberMe checkbox change
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <button
          className={`w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid}
        >
          Sign in
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">
        Don't have an account?{" "}
        <a href="/signup" className="text-indigo-600 hover:underline">
          Sign up
        </a>
      </p>
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
}

export default LoginPage;
