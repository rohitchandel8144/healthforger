import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/solid";
import CircularProgressBar from "./CircularProgressBar";
import Footer from "./Footer";

export default function ShowArchive() {
  const [goals, setGoals] = useState([]);

  async function handleArchiveGoals() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      // console.error("No token found in local storage");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/goals/showarchive`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      setGoals(response.data);
      
    } catch (error) {
      console.error(`Error fetching archived goals: ${error.message}`);
    }
  }
  useEffect(() => {
    handleArchiveGoals();
  }, []);

  async function handleDeleteGoal(goalId) {
    console.log(goalId);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/goals/deletegoal/${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleArchiveGoals();
      // console.log("Deleting successful");
    } catch (error) {
      console.log("Error deleting goals", error);
    }
  }

  const calculateProgress = (habit) => {
    if (!habit.weekly_summary || habit.weekly_summary.length === 0) return "0%";
    const summaryText = habit.weekly_summary[0].summary;
    const [completed, total] = summaryText.match(/\d+/g).map(Number); // Extract numbers and convert to numbers
    if (total === 0) return "0%"; // Handle division by zero or invalid data
    const progress = (completed / total) * 100;
    return Math.round(progress);
  };

  const calculateProgress2 = (habit) => {
    if (!habit.monthly_summary || habit.monthly_summary.length === 0)
      return "0%";
    const summaryText = habit.monthly_summary[0].summary;
    const [completed, total] = summaryText.match(/\d+/g).map(Number); // Extract numbers and convert to numbers
    if (total === 0) return "0%"; // Handle division by zero or invalid data
    const progress = (completed / total) * 100;
    return Math.round(progress);
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900  min-h-screen">
   
      {goals.length > 0 ? (
        <div className="grid gap-6 bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900 lg:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <motion.div
              key={goal._id}
              className="bg-white rounded-lg shadow-lg p-6 relative hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 mt-2 mr-2 flex space-x-2">
                <button
                  onClick={() => handleDeleteGoal(goal._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-2xl font-semibold text-green-600 mb-2">
                {goal.target}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Description:</span>{" "}
                {goal.description}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Deadline:</span>{" "}
                {new Date(goal.deadline).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(goal.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Updated At:</span>{" "}
                {new Date(goal.updatedAt).toLocaleDateString()}
              </p>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Habits
              </h3>
              <ul className="list-disc ml-4">
                {Array.isArray(goal.habits) && goal.habits.length > 0 ? (
                  goal.habits.map((habit) => (
                    <li key={habit._id} className="mb-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">Habit Name:</span>{" "}
                        {habit.habit_name}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-semibold">Weekly Summary:</span>
                      </p>
                      <div className="mt-2">
                        <CircularProgressBar
                          percentage={calculateProgress(habit)}
                          size={70}
                        />
                      </div>
                      {/* {habit.weekly_summary && Array.isArray(habit.weekly_summary) && habit.weekly_summary.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {habit.weekly_summary.map((summary, index) => (
                            <li key={index} className="text-gray-700">
                              <span className="font-semibold">{new Date(summary.week_start).toLocaleDateString()} - {new Date(summary.week_end).toLocaleDateString()}:</span> {summary.summary}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700">No weekly summaries available.</p>
                      )} */}
                      <p className="text-gray-700">
                        <span className="font-semibold">Monthly Summary:</span>
                      </p>
                      <div className="mt-2">
                        <CircularProgressBar
                          percentage={calculateProgress2(habit)}
                          size={70}
                        />
                      </div>
                      {/* 
                      {habit.monthly_summary && Array.isArray(habit.monthly_summary) && habit.monthly_summary.length > 0 ? (
                        <ul className="list-disc ml-6">
                          {habit.monthly_summary.map((summary, index) => (
                            <li key={index} className="text-gray-700">
                              <span className="font-semibold">{new Date(summary.month_start).toLocaleDateString()} - {new Date(summary.month_end).toLocaleDateString()}:</span> {summary.summary}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700">No weekly summaries available.</p>
                      )}
 */}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-700">
                    No habits available for this goal.
                  </p>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">No goals available.</p>
      )}
      
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
}
