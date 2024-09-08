import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 8px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top: 8px solid #3498db; /* Main color */
          border-right: 8px solid rgba(255, 255, 255, 0.3); /* Light fade */
          border-bottom: 8px solid rgba(255, 255, 255, 0.1); /* Light fade */
          border-left: 8px solid rgba(255, 255, 255, 0.3); /* Light fade */
          width: 80px;
          height: 80px;
          animation: spin 1s linear infinite, pulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(52, 152, 219, 0.7); /* Blue glow effect */
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
