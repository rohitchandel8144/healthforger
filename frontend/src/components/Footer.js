import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-800 dark:bg-blue-900 text-gray-300 dark:text-gray-300 py-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Center the content using flex */}
        <div className="flex flex-col items-center mb-8">
          <h5 className="text-lg font-semibold text-white mb-4 text-center">
            Follow Us
          </h5>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/"
              className="text-gray-300 dark:text-gray-300 hover:text-yellow-300 dark:hover:text-yellow-400 transition duration-300"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://x.com/RohitCh18283359"
              className="text-gray-300 dark:text-gray-300 hover:text-yellow-300 dark:hover:text-yellow-400 transition duration-300"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://www.instagram.com/rohit_ch20/"
              className="text-gray-300 dark:text-gray-300 hover:text-yellow-300 dark:hover:text-yellow-400 transition duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://linkedin.com/in/rohitch15"
              className="text-gray-300 dark:text-gray-300 hover:text-yellow-300 dark:hover:text-yellow-400 transition duration-300"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <div className="border-t border-gray-700 dark:border-gray-600 pt-6 text-center text-sm text-gray-400 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Habit Forger. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
