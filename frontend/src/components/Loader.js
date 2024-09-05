import React from "react";

const Loader = () => {
  console.log("loader running");
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          border-top: 4px solid #3498db; /* Gradient-like effect */
          width: 60px;
          height: 60px;
          animation: spin 0.8s ease-in-out infinite,
            pulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 15px rgba(52, 152, 219, 0.5); /* Blue glow effect */
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
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
