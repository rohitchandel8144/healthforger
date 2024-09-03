import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiLoginCircleLine } from "react-icons/ri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useLoading } from "../context/LoadingContext";
import Loader from "../components/Loader";

function handleGoogleLogin() {
  window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google/callback`;
}

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [verificationStatus, setVerificationStatus] = useState("");
  const [serverError, setServerError] = useState("");
  const {showLoading, hideLoading,loading} = useLoading();

  const validate = () => {
    const tempErrors = {};
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email address is invalid";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    if (validate()) {

      showLoading();
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/login`,
          { email, password }
        );

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("token", JSON.stringify(response.data.auth));
          navigate("/");
        } else {
          console.log("Please enter correct data");
          window.alert("Please enter correct data");
        }
      } catch (error) {
        console.log("Error during login attempt:", error);

        if (error.response) {
          console.log("Error response data:", error.response.data);
          console.log("Error response status:", error.response.status);

          if (error.response.status === 403) {
            const result = error.response.data.result;
            setServerError(error.response.data.result);
            console.log("Result from error response:", result);

            if (result === "Your account is not activated") {
              console.log("Account not activated, setting verificationStatus");
              setVerificationStatus("Your account is not activated");
              setServerError("Your account is not activated");
            } else {
              console.error("Forbidden error:", result);
              setServerError(result);
            }
          } else if (error.response.status === 401) {
            console.error("Unauthorized error:", error.response.data.result);
            setServerError(error.response.data.result);
          } else if (error.response.status === 404) {
            console.error("Not Found error:", error.response.data.result);
            setServerError(error.response.data.result);
          } else {
            console.error("Unexpected error response:", error.response);
          }
        } else if (error.request) {
          console.error("Error request:", error.request);
          window.alert("Network error: No response from server");
        } else {
          console.error("Error message:", error.message);
          window.alert("Error: " + error.message);
        }
      }finally{
        hideLoading();
      }
    }
  }

  useEffect(() => {
    if (verificationStatus === "Your account is not activated") {
      navigate("/sendotp", { state: { email, from: "login" } });
    }
  }, [verificationStatus, navigate, email]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          <RiLoginCircleLine className="inline-block mr-2 text-blue-500 dark:text-blue-300" />
          Login
        </h1>
        {serverError && (
          <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
            {serverError}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 p-3 w-full h-12 border ${
                  errors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-700"
                } rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-2">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 p-3 w-full h-12 border ${
                  errors.password
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-700"
                } rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-2">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800 transition duration-300"
          >
            Login
          </button>
       

          <div className="mt-4 text-center">
            <button
              onClick={() =>
                email
                  ? navigate("/sendotp", {
                      state: { email, from: "forgotpassword" },
                    })
                  : setServerError("Please enter your email first")
              }
              className="text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot Password?
            </button>
          </div>
        </form>
        <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 mt-4"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png" // Official Google G logo
              alt="Google logo"
              className="w-5 h-5 mr-3"
            />
            <span className="font-medium">Login with Google</span>
          </button>
      </div>
      {loading && <Loader />} {/* Render Loader based on loading state */}
      </motion.div>
 
  );
}
