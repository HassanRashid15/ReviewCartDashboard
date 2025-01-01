"use client"; // Add this directive at the top of the file

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons from react-icons
import { toast } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [passwordStrength, setPasswordStrength] = useState(""); // To store password strength

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = "";
    const lengthCriteria = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|`~]/.test(password);

    if (
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
    } else if (lengthCriteria) {
      strength = "weak";
    }

    setPasswordStrength(strength);
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Show success notification
      toast.success("Account created successfully!", { autoClose: 3000 });

      // Clear the form data after submission (optional)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } else {
      // Show error notification
      toast.error("Please fix the errors in the form", { autoClose: 3000 });
    }
  };

  // Check if the submit button should be enabled
const isFormValid = () => {
  return (
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    passwordStrength === "strong" && // Ensure the password strength is "strong"
    !Object.keys(errors).length
  );
};

  return (
    <div className="p-4 pt-20 sm:p-20" style={{ paddingBottom: "1rem" }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create Account!
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Please fill in your information
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-600">
              First Name
            </label>
            <div className="flex items-center border py-1 border-gray-300 rounded-lg overflow-hidden">
              <FaUser className="text-gray-500 text-2xl pl-3" />
              <input
                id="firstname"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full px-2 pr-4 py-2 text-sm outline-none text-black"
              />
            </div>

            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Last Name
            </label>
            <div className="flex items-center border py-1 border-gray-300 rounded-lg overflow-hidden">
              <FaUser className="text-gray-500 text-2xl pl-3" />
              <input
                id="lastname"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full px-3 py-2 pl-2 text-sm outline-none text-black"
              />
            </div>

            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <div className="flex items-center border py-1 border-gray-300 rounded-lg overflow-hidden">
              <MdEmail className="text-gray-500 text-3xl pl-3" />
              <input
                id="signupemail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 pl-1 text-sm outline-none text-black"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
              {formData.password && passwordStrength && (
                <div
                  className={`mt-1 text-xs ${
                    passwordStrength === "strong"
                      ? "text-green-500"
                      : passwordStrength === "medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {passwordStrength === "strong" && "Strong password"}
                  {passwordStrength === "medium" && "Medium password"}
                  {passwordStrength === "weak" && "Weak password"}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                id="signuppassword"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 text-sm outline-none text-black border py-1 border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-2 rounded-lg font-medium transition ${
              isFormValid()
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Sign up
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-500 mb-2">
          Already have an account?
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-500 ml-1 hover:underline"
          >
            Sign in
          </a>
        </p>
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-sm text-gray-400">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>
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
      </div>
      <toast-container />
    </div>
  );
}

export default SignUpPage;
