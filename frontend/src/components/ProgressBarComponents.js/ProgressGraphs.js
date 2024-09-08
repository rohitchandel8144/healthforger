import React, { useEffect, useState, useRef } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Updated transform function for Habit Trends
const transformHabitTrends = (data) => {
  const labels = data.map((item) => {
    const { year, month, day } = item._id;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  });
  const totalCompleted = data.map((item) => item.totalCompleted);

  return {
    labels,
    datasets: [
      {
        label: "Habit Completion",
        data: totalCompleted,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };
};

// Transform function for Goal Progress
const transformGoalProgress = (data) => {
  const labels = data.map((item) => item.description);
  const completedHabits = data.map((item) => item.completedHabits);

  return {
    labels,
    datasets: [
      {
        label: "Goal Progress",
        data: completedHabits,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };
};

// Transform function for Category Breakdown
const transformCategoryBreakdown = (data) => {
  const labels = data.map((item) => item._id);
  const counts = data.map((item) => item.count);

  return {
    labels,
    datasets: [
      {
        label: "Category Breakdown",
        data: counts,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };
};

const ProgressGraphs = () => {
  const [habitTrendsData, setHabitTrendsData] = useState(null);
  const [goalProgressData, setGoalProgressData] = useState(null);
  const [categoryBreakdownData, setCategoryBreakdownData] = useState(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("token")); // Adjust based on where you store your token

      try {
        const [
          habitTrendsResponse,
          goalProgressResponse,
          categoryBreakdownResponse,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/habitTrends`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/goalProgress`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/categoryBreakdown`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        console.log(habitTrendsResponse.data);
        setHabitTrendsData(transformHabitTrends(habitTrendsResponse.data));
        setGoalProgressData(transformGoalProgress(goalProgressResponse.data));
        setCategoryBreakdownData(
          transformCategoryBreakdown(categoryBreakdownResponse.data)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 mt-4 md:mt-6 max-w-full md:max-w-2xl mx-auto">
    <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      Progress Graphs
    </h2>
  
    <div className="mb-4 md:mb-6">
      <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Habit Completion Over Time
      </h3>
      {habitTrendsData && (
        <div className="relative h-60 md:h-96">
          <Line
            data={habitTrendsData}
            ref={lineChartRef}
            options={{ responsive: true }}
          />
        </div>
      )}
    </div>
  
    <div className="mb-4 md:mb-6">
      <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Goal Progress
      </h3>
      {goalProgressData && (
        <div className="relative h-60 md:h-96">
          <Bar
            data={goalProgressData}
            ref={barChartRef}
            options={{ responsive: true }}
          />
        </div>
      )}
    </div>
  
    <div>
      <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Habits by Category
      </h3>
      {categoryBreakdownData && (
        <div className="relative h-60 md:h-96">
          <Bar
            data={categoryBreakdownData}
            ref={barChartRef}
            options={{ responsive: true }}
          />
        </div>
      )}
    </div>
  </div>
  
  );
};

export default ProgressGraphs;
