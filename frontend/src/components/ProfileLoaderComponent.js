import React from 'react';

const ProfileLoader = () => {
  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 dark:from-gray-700 dark:to-gray-900 rounded-full border-4 border-transparent shadow-lg">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 animate-pulse"></div>
      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-t-4 border-r-4 border-white dark:border-gray-300 animate-spin"></div>
    </div>
  );
};

export default ProfileLoader;
