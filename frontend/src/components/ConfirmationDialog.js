import React from "react";
import { motion } from "framer-motion";

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  message,
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg w-full"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="mb-6 text-gray-800 dark:text-gray-100 text-lg">
          {message}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-600 dark:bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors duration-300"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors duration-300"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
