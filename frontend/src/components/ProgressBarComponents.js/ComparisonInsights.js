import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const ComparisonInsights = () => {
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));

        const [bestWorstDaysResponse, performanceResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/progress/bestWorstDays`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/progress/weeklyVsMonthlyPerformance`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const bestWorstDays = bestWorstDaysResponse.data;
        const bestDays = bestWorstDays.reduce((prev, current) =>
          prev.totalCompleted > current.totalCompleted ? prev : current
        );
        const worstDays = bestWorstDays.reduce((prev, current) =>
          prev.totalCompleted < current.totalCompleted ? prev : current
        );

        setPieData({
          labels: ["Best Days", "Worst Days"],
          datasets: [
            {
              data: [bestDays.totalCompleted, worstDays.totalCompleted],
              backgroundColor: ["#36A2EB", "#FF6384"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        });

        const weeklyData = performanceResponse.data.weeklySummary;
        const monthlyData = performanceResponse.data.monthlySummary;

        setPerformanceData({
          labels: ["Weekly", "Monthly"],
          datasets: [
            {
              label: "Total Completed",
              data: [
                weeklyData.totalCompletedWeekly,
                monthlyData.totalCompletedMonthly,
              ],
              backgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: "inherit",
        },
      },
      tooltip: {
        callbacks: {
          labelTextColor: function (context) {
            return context.label === "Best Days" ? "#36A2EB" : "#FF6384";
          },
        },
      },
    },
  };

  const barOptions = {
    plugins: {
      legend: {
        labels: {
          color: "inherit",
        },
      },
      tooltip: {
        callbacks: {
          labelTextColor: function (context) {
            return "#000000";
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "inherit",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "inherit",
        },
        grid: {
          color: "#ddd",
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Comparison & Insights
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Best/Worst Days
        </h3>
        <div className="relative h-120">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Weekly vs. Monthly Performance
        </h3>
        <div className="relative h-80">
          {performanceData && (
            <Bar data={performanceData} options={barOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonInsights;
