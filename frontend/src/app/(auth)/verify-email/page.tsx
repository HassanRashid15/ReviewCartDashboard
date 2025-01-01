import React, { useState, useEffect } from "react";
import { Mail, ArrowRight, RefreshCw, HelpCircle } from "lucide-react";

const VerifyEmail = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

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

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = element.value;
    setOtpValues(newOtpValues);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setTimer(30);
      setCanResend(false);
      // Add your resend logic here
    }
  };

  return (
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
              We have sent a verification code to your email
            </p>
            <p className="mt-1 text-gray-600 font-medium">example@email.com</p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="flex flex-col items-center">
              <label className="text-sm text-gray-700 mb-4">
                Enter verification code
              </label>
              <div className="flex gap-2">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyUp={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !e.target.value &&
                        e.target.previousSibling
                      ) {
                        e.target.previousSibling.focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify Email
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendCode}
                disabled={!canResend}
                className={`font-medium inline-flex items-center gap-1 ${
                  canResend
                    ? "text-indigo-600 hover:text-indigo-500 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Resend Code
                {!canResend && ` (${timer}s)`}
              </button>
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p>
                Can't find the verification email?{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Check your spam folder
                </a>{" "}
                or{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
