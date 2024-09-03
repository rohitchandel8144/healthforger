import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoGoal } from "react-icons/go";
import { RiLoginCircleLine, RiLogoutCircleLine } from "react-icons/ri";
import { IoHome } from "react-icons/io5";
import { GiAwareness } from "react-icons/gi";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaTasks } from "react-icons/fa";
import ConfirmationDialog from "./ConfirmationDialog";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import ProfileSlider from "./ProfileSliderComponent";

const Navbar = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const auth = localStorage.getItem("user");
  const parsedAuth = typeof auth === "string" ? JSON.parse(auth) : auth; // Parse if it's a string
  const role = parsedAuth?.role === "admin"; // Check if the role is 'admin'
  
  const navigate = useNavigate();

  function toggleSlider() {
    setIsSliderOpen(!isSliderOpen);
  }

  useEffect(() => {
    // Apply dark mode class based on state
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  function handleLogoutClick() {
    setIsDialogOpen(true);
  }

  function handleConfirm() {
    handleLogout();
    setIsDialogOpen(false);
  }

  function handleClose() {
    setIsDialogOpen(false);
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", !isDarkMode);
  }

  return (
    <motion.nav
      className={`p-4 shadow-lg ${
        isDarkMode ? "bg-blue-900 text-gray-300" : "bg-blue-800 text-gray-300"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <motion.svg
            className="w-8 h-8 mr-2"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              ry="2"
              fill={isDarkMode ? "#4CAF50" : "#4CAF50"}
            />
            <motion.path
              d="M9 11l3 3L22 4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          <motion.div
            className="text-2xl font-bold cursor-pointer flex items-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Health FoRGer
          </motion.div>
        </div>
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ rotate: 0 }}
                animate={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </motion.svg>
            ) : (
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ rotate: 0 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </motion.svg>
            )}
          </button>
        </div>
        <motion.div
          className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
            isOpen ? "block" : "hidden"
          }`}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex flex-col lg:flex-row lg:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {auth ? (
              <>
                <motion.div
                  className="lg:flex-grow lg:ml-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/"
                    className="block mt-4 lg:inline-block lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                  >
                    <IoHome className="inline-block mr-1" />
                    Home
                  </Link>
                </motion.div>
                <motion.div
                  className="lg:flex-grow lg:ml-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/habittracker"
                    className="block mt-4 lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                  >
                    <FaTasks className="inline-block mr-1" />
                    HabitTracker
                  </Link>
                </motion.div>
                <motion.div
                  className="lg:flex-grow lg:ml-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/goalsetting"
                    className="block mt-4 lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                  >
                    <GoGoal className="inline-block mr-1" />
                    Goal Setting
                  </Link>
                </motion.div>
                <motion.div
                  className="lg:flex-grow lg:ml-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/progressvisualization"
                    className="block mt-4 lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                  >
                    <GiAwareness className="inline-block mr-1" />
                    Progress Visualization
                  </Link>
                </motion.div>
                <motion.div
                  className="lg:flex-grow lg:ml-8 flex items-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    onClick={handleLogoutClick}
                    className="block mt-4 lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                  >
                    <RiLogoutCircleLine className="inline-block mr-2" />
                    Logout ({JSON.parse(auth).name})
                  </Link>
                </motion.div>

                <motion.div
                  className="lg:flex-grow lg:ml-8 flex items-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    onClick={toggleSlider}
                    className="p-2 hover:text-yellow-300 transition-colors duration-300 lg:ml-4 mt-4 lg:mt-0 flex items-center"
                  >
                    Profile
                  </motion.button>
                </motion.div>

                {/* Admin-only Link */}
                {role && (
                  <motion.div
                    className="lg:flex-grow lg:ml-8"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to="/admin"
                      className="block mt-4 lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                    >
                      <SiGnuprivacyguard className="inline-block mr-1" />
                      Admin Panel
                    </Link>
                  </motion.div>
                )}

                <ProfileSlider isOpen={isSliderOpen} onClose={toggleSlider} />
              </>
            ) : (
              <>
                <motion.div
                  className="lg:flex-grow lg:ml-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/"
                    className="block mt-4 lg:inline-block lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                  >
                    <IoHome className="inline-block mr-1" />
                    Home
                  </Link>
                </motion.div>
                <motion.div
                  className="lg:flex-grow lg:ml-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/login"
                    className="block mt-4 lg:inline-block lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                  >
                    <RiLoginCircleLine className="inline-block mr-1" />
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  className="lg:flex-grow lg:ml-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="signup"
                    className="block mt-4 lg:mt-0 hover:text-yellow-300 transition-colors duration-300"
                  >
                    <SiGnuprivacyguard className="inline-block mr-1" />
                    SignUp
                  </Link>
                </motion.div>
              </>
            )}
            <motion.div
              className="lg:flex-grow lg:ml-8 flex items-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={toggleDarkMode}
                className="p-2  hover:text-yellow-300 transition-colors duration-300 mt-4 lg:mt-0 flex items-center"
              >
                {isDarkMode ? (
                  <MdLightMode className="mr-2" />
                ) : (
                  <MdDarkMode className="mr-2" />
                )}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirm}
        onClose={handleClose}
        message="Are you sure you want to logout?"
      />
    </motion.nav>
  );
};

export default Navbar;
