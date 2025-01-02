"use client"; // Add this directive at the top of the file

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Mail, ArrowRight, RefreshCw, HelpCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; // Make sure to import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Make sure to import the CSS
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

interface VerifyEmailProps {
  // Define any props you may want to pass to the component (optional)
}

const VerifyEmail: React.FC<VerifyEmailProps> = () => {
  const [otpValues, setOtpValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(""); // Add email state

  const router = useRouter(); // Instantiate the useRouter hook for navigation

  // Effect to handle OTP timer countdown
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) {
      setCanResend(true);
    }
  }, [timer]);

  // Handle OTP input changes
  const handleChange = (element: HTMLInputElement, index: number): void => {
    if (isNaN(Number(element.value))) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = element.value;
    setOtpValues(newOtpValues);

    // Log OTP digits to the console whenever the OTP values change
    console.log("OTP digits:", newOtpValues.join(""));

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // Handle "Resend Code" button click
  const handleResendCode = async (): Promise<void> => {
    if (canResend) {
      setOtpValues(["", "", "", "", "", ""]); // Clear OTP fields
      setTimer(30);
      setCanResend(false);

      // Extract email from the URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get("email"); // Get the 'email' query parameter

      // Trigger resend verification logic
      try {
        const response = await fetch(
          "http://localhost:4000/users/resend-verification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email, // Use the extracted email from the URL
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          toast.success("Verification code resent successfully!");
        } else {
          setMessage(data.message);
          toast.error("Failed to resend verification code.");
        }
      } catch (error) {
        setMessage("Failed to resend verification code. Please try again.");
        toast.error("Failed to resend verification code.");
      }
    }
  };

  // Handle form submission to verify OTP
  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    // Extract email from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email"); // Get the 'email' query parameter

    if (!email) {
      toast.error("Email address is missing from the URL.");
      setLoading(false);
      return;
    }

    try {
      const otp = otpValues.join(""); // Join OTP values
      const response = await fetch("http://localhost:4000/users/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, code: otp }), // Use the extracted email from the URL
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        toast.success("Email verified successfully!");

        // Redirect to login page
        router.push("/login"); // Redirect after successful verification
      } else {
        setMessage(data.message);
        toast.error("Verification failed. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to verify email. Please try again.");
      toast.error("Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    console.log("Email entered: ", e.target.value); // Log email to console
  };

  // Automatically trigger OTP submission when all fields are filled
  useEffect(() => {
    if (otpValues.every((value) => value !== "")) {
      handleSubmit(new Event("submit")); // Trigger handleSubmit if all OTP values are filled
    }
  }, [otpValues]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Main Card */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Verify Your Email
              </h2>
              <p className="mt-2 text-gray-600">
                We sent a verification code to your email address. Enter the
                code below to verify.
              </p>
            </div>

            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="flex justify-center space-x-4 mb-4 flex-wrap gap-1">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChange(e.target, index)}
                    className="w-11 h-11 text-center text-lg text-slate-600 wrap font-medium border rounded-md mb-3"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={otpValues.some((value) => value === "") || loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  otpValues.every((value) => value !== "") && !loading
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center text-sm text-slate-600">
                {message}
              </p>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={handleResendCode}
                disabled={!canResend}
                className={`text-sm text-indigo-600 hover:text-indigo-500 ${
                  !canResend && "cursor-not-allowed"
                }`}
              >
                {canResend ? (
                  <>
                    <RefreshCw className="inline-block mr-2" />
                    Resend Code
                  </>
                ) : (
                  <span>Resend in {timer}s</span>
                )}
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Need Help?
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Still having trouble?{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">
                    Contact support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Toastify Container */}
      <ToastContainer />
    </>
  );
};

export default VerifyEmail;
