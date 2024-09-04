import React, { useEffect, useState } from "react";
import { RiMailSendLine } from "react-icons/ri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import { useLoading } from "../context/LoadingContext";
import Loader from "./Loader";

export default function SendOtp() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { loading, showLoading, hideLoading } = useLoading();

  const location = useLocation();
  const email = location?.state?.email;
  const from = location?.state?.from;
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      hideLoading();
      navigate("/");
    }
  }, [email, navigate]);

  async function handleForgotPassword() {
    showLoading();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/forgotPassword/${email}`
      );
      setSuccess("OTP sent successfully. Please check your email.");

      navigate("/verifyotp", { state: { email, from: "forgotpassword" } });
      hideLoading();
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      hideLoading();
    }
  }

  async function handleClick() {
    showLoading(); // Start loading
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/sendOtp/${email}`
      );
      setSuccess("OTP sent successfully. Please check your email.");

      navigate("/verifyotp", { state: { email } });
      hideLoading();
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      hideLoading(); // Stop loading
    } 
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
            Send OTP
          </h1>

          <div className="mb-4 text-center">
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
          </div>

          {loading ? (
            <div className="text-center">Sending OTP...</div>
          ) : (
            <>
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
              <button
                type="button"
                onClick={
                  from === "forgotpassword" ? handleForgotPassword : handleClick
                }
                className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800 transition duration-300"
              >
                Send OTP
              </button>
            </>
          )}
        </div>
        {loading && <Loader />}
      </motion.div>
      <div className="mt-4">
        <Footer />
      </div>
    </>
  );
}
