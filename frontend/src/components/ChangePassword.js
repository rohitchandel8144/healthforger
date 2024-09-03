import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdPassword } from "react-icons/md";
import Loader from "./Loader";
import { useLoading } from "../context/LoadingContext";
export default function ChangePassword({ email }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for storing error messages
  const [success, setSuccess] = useState(""); // State for storing success messages
  const{loading,showLoading,hideLoading}=useLoading();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      showLoading();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/changePassword`,
        {
          email,
          password, // Make sure the key matches the backend parameter
        }
      );

      if (response.data.status === "success") {
        setSuccess("Password changed successfully");
        setError(""); // Clear any existing errors
        navigate("/login"); 
        hideLoading();
      } else {
        setError("Failed to change password");
        setSuccess(""); // Clear any existing success messages
      }
    } catch (error) {
      hideLoading();
      console.error("Error changing password:", error);
      setError(error.response?.data?.error || "Something went wrong");
      setSuccess(""); // Clear any existing success messages
    }finally{
      hideLoading();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          <MdPassword className="inline-block mr-2" />
          Change Password
        </h1>

        {/* Center error and success messages */}
        <div className="mb-4 text-center">
          {error && <div className="text-red-500 dark:text-red-400">{error}</div>}
          {success && <div className="text-green-500 dark:text-green-400">{success}</div>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            value={email}
            readOnly
            placeholder="Email"
            className="p-3 w-full border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="p-3 w-full border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          />
        </div>
        <button
          type="button"
          className="bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 w-full"
          onClick={handleSubmit}
        >
          Change Password
        </button>
        {loading && <Loader/>}
      </div>
    </div>
  );
}
