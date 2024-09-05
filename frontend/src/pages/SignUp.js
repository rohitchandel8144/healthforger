import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SiGnuprivacyguard } from "react-icons/si";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from "../components/Loader";
import { useLoading } from "../context/LoadingContext";

export default function SignUp() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const {loading,showLoading,hideLoading}=useLoading();

  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!name) tempErrors.name = "Name is required";
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email address is invalid";
    }
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/sendotp", { state: { email, from: "login" } });
    }
  }, [navigate, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (validate()) {
      showLoading();
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/signup`,
          {
            name,
            password,
            email,
            recaptchaToken,
          }
        );
        console.log(response.data.auth);
        localStorage.setItem("user", JSON.stringify(response.data.result));
        localStorage.setItem("token", JSON.stringify(response.data.auth));
        navigate("/sendotp", { state: { email } });
      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            if (
              error.response.data.result === "Your account is not activated"
            ) {
              navigate("/sendotp", { state: { email, from: "signup" } });
            } else {
              setServerError(error.response.data.result);
            }
          } else {
            setServerError(error.response.data.message);
          }
        } else if (error.request) {
          setServerError("No response from server. Please try again later.");
        } else {
          setServerError(error.message);
        }
      }finally{
        hideLoading();
      }
    }
  };

  return (
    <>
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
            <SiGnuprivacyguard className="inline-block mr-2 text-blue-500 dark:text-blue-300" />
            Sign Up
          </h1>
          {serverError && (
            <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-2">{errors.name}</p>
              )}
            </div>
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
                  required
                  className="pl-10 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                  required
                  className="pl-10 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2">{errors.password}</p>
              )}
            </div>
            <div className="mb-6">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 p-3 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <ReCAPTCHA
              sitekey="6Lct7S8qAAAAADTW8vn0bkAfKW0pPVM3qZMUs-kp"
              onChange={(token) => setRecaptchaToken(token)}
              className="mb-4"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-800 transition duration-300"
            >
              Sign Up
            </button>
            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
        
      </motion.div>
      {loading && <Loader />}
      <div className="mt-4 w-full">
        <Footer />
      </div>
    </>
  );
}
