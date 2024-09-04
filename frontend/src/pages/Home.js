import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Cog6ToothIcon,
  ChartBarSquareIcon,
  BellAlertIcon,
  MoonIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  StarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import ImageSlider from "../components/imageSlider"; // Import your slider component
import Footer from "../components/Footer";

const HomePage = () => {
  const iconClass = "w-12 h-12 text-blue-500";
  let auth = JSON.parse(localStorage.getItem("user"));
  console.log(auth);
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen relative">
      {/* Image Slider Container */}
      <div className="relative h-[400px] md:h-[600px] overflow-hidden">
        <ImageSlider />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center z-10 p-4 md:p-8">
          {/* Hero Section */}
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Forge Your Best Habits
          </motion.h1>
          <motion.p
            className="text-base md:text-lg lg:text-xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Track, Improve, and Transform Your Daily Routines.
          </motion.p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            {auth ? (
              <div className="bg-transparent p-6 rounded-lg text-white text-center">
                <motion.h2
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome, {auth.name}!
                </motion.h2>
                <motion.p
                  className="text-sm md:text-base mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  We're excited to have you back. Explore your dashboard and
                  continue forging your best habits!
                </motion.p>
              </div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login">
                    <motion.button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300">
                      Login
                    </motion.button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/signup">
                    <motion.button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300">
                      SignUp
                    </motion.button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rest of the Content */}
      <div className="relative z-20 -mt-20 bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900">
        {/* Key Features Section */}
        <section className="py-12 md:py-16 px-4 md:px-8 bg-gray-100 dark:bg-gray-900">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8 md:mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full mb-4">
                <Cog6ToothIcon className={iconClass} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Customizable Habit Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tailor your habit tracking experience to suit your needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full mb-4">
                <ChartBarSquareIcon className={iconClass} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Progress Visualization
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your progress and stay motivated.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full mb-4">
                <BellAlertIcon className={iconClass} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Daily Reminders
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Never miss a day with personalized reminders.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full mb-4">
                <MoonIcon className={iconClass} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Dark Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enjoy an aesthetic and eye-friendly dark mode.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full mb-4">
                <CalendarDaysIcon className={iconClass} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Habit Calendar
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track your habits over time with a detailed calendar view.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full mb-4">
                <ClipboardDocumentCheckIcon className={iconClass} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Task Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize and prioritize your tasks alongside your habits.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full mb-4">
                <StarIcon className={iconClass} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Achievements
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Unlock achievements as you reach your goals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full mb-4">
                <CheckCircleIcon className={iconClass} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Accountability
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay on track with accountability partners and shared goals.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-sky-500 dark:bg-blue-700 text-white py-12 md:py-16 px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Join Thousands of Users Forging Their Best Habits
          </h2>
          <p className="text-base md:text-lg mb-6">
            Start your journey today and build a better future with Habit
            Forger.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/goalsetting">
              <motion.button className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition duration-300">
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </div>

      <Footer className="py-6 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center" />
    </div>
  );
};

export default HomePage;
