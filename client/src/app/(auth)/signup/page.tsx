"use client"; // Add this directive at the top of the file
import { useRouter } from 'next/router';  // Import the Next.js useRouter hook

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons from react-icons
import { toast, ToastContainer } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading animation
  const [isSubmitted, setIsSubmitted] = useState(false); // For success checkmark
  const [progress, setProgress] = useState(0); // For progress tracking

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

    console.log(name, value); // Log the field name and value

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = "";
    const lengthCriteria = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|`~]/.test(password);

    if (!hasUpperCase) {
      strength = "Password must contain at least one uppercase letter.";
    } else if (!hasLowerCase) {
      strength = "Password must contain at least one lowercase letter.";
    } else if (!hasNumber) {
      strength = "Password must contain at least one number.";
    } else if (!hasSpecialChar) {
      strength = "Password must contain at least one special character.";
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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (validate()) {
    setIsSubmitting(true); // Trigger the loading animation
    setProgress(0); // Reset the progress to 0 before submission starts

    // Start updating the progress bar dynamically
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(progressInterval); // Stop updating when progress is 100%
          return 100;
        } else {
          return prevProgress + 2; // Increment progress by 2% to make it smoother
        }
      });
    }, 200); // Update progress every 200ms for smoother animation

    try {
      // Simulate form submission (replace with actual fetch request)
      const response = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          fullname: {
            firstname: formData.firstName,
            lastname: formData.lastName,
          },
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!", { autoClose: 3000 });

        // Wait for 4 seconds after the progress reaches 100%
        setTimeout(() => {
          setIsSubmitting(false); // Stop loading animation
          setIsSubmitted(true); // Show checkmark (success state)
        }, 2000); // Delay 4 seconds before success message

        setTimeout(() => {
          if (formData.email && formData.email.trim() !== "") {
            window.location.href = "/verify-email/?email=" + formData.email;
          } else {
            window.location.href = "/"; // Redirect to homepage if email is not available
          }
        }, 3000); // Redirect after 3 seconds
      } else {
        clearInterval(progressInterval); // Stop progress bar if an error occurs
        setIsSubmitting(false); // Stop loading animation
        toast.error(data.message || "An error occurred", { autoClose: 3000 });
      }
    } catch (error) {
      clearInterval(progressInterval); // Stop progress bar if an error occurs
      setIsSubmitting(false); // Stop loading animation
      toast.error("Network error, please try again later", { autoClose: 3000 });
    }
  } else {
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
        <form className="space-y-4 py-8" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-600">
              First Name
            </label>
            <div className="flex items-center border py-1 border-gray-300 rounded-lg overflow-hidden">
              <FaUser className="text-gray-800 text-3xl pl-3" />
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
              <FaUser className="text-gray-800 text-3xl pl-3" />
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
              <MdEmail className="text-gray-800 text-4xl pl-3" />
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
            disabled={!isFormValid() || isSubmitting}
            className={`w-full py-2 rounded-lg font-medium transition ${
              isFormValid() && !isSubmitting
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <div className="relative w-full h-2 bg-gray-300 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    width: `${progress}%`, // Dynamic progress based on the current state
                    backgroundColor: "rgb(99, 102, 241)", // Customize color here
                    transition: "width 0.2s ease-in-out", // Smooth transition for progress
                    borderRadius: "9999px", // Make the progress bar rounded
                  }}
                />
                <div className="absolute top-0 left-0 w-full flex justify-center items-center text-white text-xs font-medium">
                  {`${Math.round(progress)}%`}{" "}
                  {/* Displaying the percentage of progress */}
                </div>
              </div>
            ) : isSubmitted ? (
              <div className="flex justify-center items-center space-x-2">
                {/* Success check mark */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Success!</span>
              </div>
            ) : (
              "Sign up"
            )}
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
      <ToastContainer />
    </div>
  );
}

export default SignUpPage;
