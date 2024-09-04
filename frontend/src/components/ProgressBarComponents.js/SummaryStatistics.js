import React, { useEffect, useState } from "react";
import axios from "axios";

const SummaryStatistics = () => {
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [milestones, setMilestones] = useState(null);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const [weeklyResponse, monthlyResponse, milestonesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/weeklySummary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/monthlySummary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/milestones`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setWeeklySummary(weeklyResponse.data);
        console.log(weeklyResponse.data)      
        setMonthlySummary(monthlyResponse.data);
        console.log(monthlyResponse.data)
        setMilestones(milestonesResponse.data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    fetchSummaryData();
  }, [token]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6 max-w-lg w-full mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b pb-2">Summary Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300">Weekly Summary</h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Total Completed:{" "}
            <span className="font-semibold">
              {weeklySummary ? weeklySummary.totalCompleted : "Loading..."}
            </span>
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium text-green-700 dark:text-green-300">Monthly Summary</h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Total Completed:{" "}
            <span className="font-semibold">
              {monthlySummary ? monthlySummary.totalCompleted : "Loading..."}
            </span>
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 shadow-sm md:col-span-2">
          <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">Milestones</h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            First Consistent Week:{" "}
            <span className="font-semibold">
              {milestones ? milestones.firstConsistentWeek : "Loading..."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStatistics;

