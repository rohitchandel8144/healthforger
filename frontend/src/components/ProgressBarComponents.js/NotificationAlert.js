import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationsAlerts = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = JSON.parse(localStorage.getItem("token"));

      try {
        const {
          data: { upcomingDeadlines, missedHabits },
        } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/progress/getNotification`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (upcomingDeadlines.length) {
          toast.info(
            `Upcoming deadlines: ${upcomingDeadlines
              .map((goal) => goal.description)
              .join(", ")}`
          );
        }

        if (missedHabits.length) {
          toast.warn(
            `Missed habits: ${missedHabits
              .map((habit) => habit.habit_name)
              .join(", ")}`
          );
        }

        // Tag each notification with its type
        const notifications = [
          ...upcomingDeadlines.map((goal) => ({ ...goal, type: "deadline" })),
          ...missedHabits.map((habit) => ({ ...habit, type: "missed" })),
        ];

        setNotifications(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6 max-w-sm w-full mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b pb-2">
        Notifications & Alerts
      </h2>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">
          Loading notifications...
        </p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No new notifications.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm"
            >
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                    notification.type === "deadline"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  } text-white`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 7.757l1.768 1.768-9 9-1.768-1.768 9-9zM4 15v5h5l-5-5z"
                    />
                  </svg>
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {notification.type === "deadline"
                    ? "Upcoming Deadline"
                    : "Missed Habit"}
                  : {notification.description || notification.habit_name}
                </p>
                {notification.deadline && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Deadline:{" "}
                    {new Date(notification.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsAlerts;
