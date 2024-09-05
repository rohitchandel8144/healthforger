import React, { useState, useEffect } from "react";
import { RiMailSendLine } from "react-icons/ri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import Loader from "./Loader";
import { useLoading } from "../context/LoadingContext";
import Footer from "./Footer";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [forgotPassword, setForgotPassword] = useState(null);
  const [error, setError] = useState(""); 
  const{loading,showLoading,hideLoading}=useLoading();
  const [success, setSuccess] = useState(""); 
 // Loading state
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;
  const from = location?.state?.from;

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (verificationStatus === "success") {
      navigate("/login");
      hideLoading();
      
    }
  }, [verificationStatus, navigate]);

  async function handleForgotPassword() {
    try {
      showLoading(); // Start loading
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verifyForgotPassword/${otp}/${email}`
      );

      if (response.data.status === "success" && from === "forgotpassword") {
        setForgotPassword("success");
      } else {
        setForgotPassword("failed");
      }
    } catch (error) {
      hideLoading(); // End loading
      setError(error.response?.data?.error || "Something went wrong");
      setForgotPassword("failed");
    }finally{
      hideLoading();
    }
  }

  async function handleClick() {
    try {
      showLoading(); // Start loading
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verifyOtp/${otp}/${email}`
      );
     // End loading

      if (response.data.status === "success" && from === "forgotpassword") {
        handleForgotPassword();
      } else if (response.data.status === "success") {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("failed");
      }
    } catch (error) {
      hideLoading(false); // End loading
      setError(error.response?.data?.error || "Something went wrong");
      setVerificationStatus("failed");
    }finally{
      hideLoading();
    }
  }

  if (forgotPassword === "success" && from === "forgotpassword") {
    return <ChangePassword email={email} />;
  }

  if (forgotPassword === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-red-500">Error: No user data found or email not available.</div>
      </div>
    );
  }

  return (
    <>
    
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          <RiMailSendLine className="inline-block mr-2" />
          Verify OTP
        </h1>

        <div className="mb-4 text-center">
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
        </div>

        <form>
          <div className="mb-4 relative">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600"
            />
            <input
              type="email"
              value={email}
              readOnly
              placeholder="E-mail"
              className="pl-10 p-3 w-full border rounded focus:outline-none focus:border-blue-500 transition-colors dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter OTP"
              className="pl-3 p-3 w-full border rounded focus:outline-none focus:border-blue-500 transition-colors dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
            />
          </div>
          <button
            type="button"
            className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800 transition duration-300"
            onClick={from === "forgotpassword" ? handleForgotPassword : handleClick}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Verifying..." : "Verify OTP"} {/* Show loading text */}
          </button>
        </form>
      </div>
    </motion.div>
    {loading && <Loader />}

    <div className="mt-4">
        <Footer/>
      </div>
    </>
  );
}
