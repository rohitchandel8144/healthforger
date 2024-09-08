import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTachometerAlt, FaStar } from "react-icons/fa";

const OverviewSection = () => {
  const [overview, setOverview] = useState({
    totalGoals: 0,
    totalHabits: 0,
    habitStatus: {
      active: 0,
      completed: 0,
    },
    currentStreaks: [],
    goalStatus: {
      archived: 0,
      active: 0,
    }, 
  });

  const token = JSON.parse(localStorage.getItem("token"));

  async function getOverview() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/progress/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response Data:", response.data);

      setOverview({
        totalGoals: response.data.totalGoals || 0,
        totalHabits: response.data.totalHabits || 0,
        habitStatus: response.data.habitStatus || { active: 0, completed: 0 },
        currentStreaks: Array.isArray(response.data.currentStreaks)
          ? response.data.currentStreaks
          : [],
        goalStatus: response.data.goalStatus || { archived: 0, active: 0 },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getOverview();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 space-y-6">
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
      Overview
    </h2>
  
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-start">
        <FaTachometerAlt className="text-blue-500 text-2xl md:text-3xl mr-3 md:mr-4" />
        <div className="w-full">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Goals & Habits Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-400">
                Total Goals:
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {overview.totalGoals}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-400">
                Total Habits:
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {overview.totalHabits}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-400">
                Active Goals:
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {overview.goalStatus.active}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-400">
                Archived Goals:
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {overview.goalStatus.archived}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-400">
                Active Habits:
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {overview.habitStatus.active}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-400">
                Completed Habits:
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {overview.habitStatus.completed}
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-start">
        <FaStar className="text-yellow-500 text-2xl md:text-3xl mr-3 md:mr-4" />
        <div className="w-full">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Current Streaks
          </h3>
          <div className="mt-2">
            {overview.currentStreaks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {overview.currentStreaks.map((streak) => (
                  <div key={streak.habitName} className="flex flex-col">
                    <p className="text-gray-600 dark:text-gray-400">
                      {streak.habitName}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Longest Streak: {streak.streak} days
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No current streaks
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default OverviewSection;
