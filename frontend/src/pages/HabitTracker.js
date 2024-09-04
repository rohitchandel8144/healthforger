import { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/solid";
import AddHabit from "../components/AddHabit";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import ConfirmationDialog from "../components/ConfirmationDialog";

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [targetFrequency, setTargetFrequency] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("goal");
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [DeleteGoalId, SetDeleteGoalId] = useState(null);

  async function fetchHabits() {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/habits/habits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Full API response:", response.data);
      setHabits(response.data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  }

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  async function handleAddHabit() {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const newHabitData = {
        habit_name: habitName,
        description: description,
        category: category,
        target_frequency: targetFrequency,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/habits/addhabits`,
        newHabitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Habit added successfully:", response.data);
      setHabitName("");
      setDescription("");
      setCategory("");
      setTargetFrequency("");
      setOpenDialog(false);
      fetchHabits(); // Refresh habits after adding a new one
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      }
      console.error("Error adding habit:", error);
    }
  }

  async function handleSearch(searchQuery, searchBy) {
    console.log(searchBy);
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      if (!searchQuery) {
        alert("Field is empty");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/habits/getSearchHabits/${searchQuery}/${searchBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setHabits(response.data);
      setSearchQuery("");
      setError("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No habits found matching the search query");
      } else {
        setError("An error occurred while searching for habits");
      }
      setHabits([]);
    }
  }

  function handleConfirmDeleteHabit(GoalId) {
    setIsDialogOpen(true);
    console.log(GoalId);
    SetDeleteGoalId(GoalId);
  }

  function handleConfirmHabit() {
    handleDeleteHabit(DeleteGoalId);
    setIsDialogOpen(false);
  }

  function handleCloseHabit() {
    setIsDialogOpen(false);
  }

  async function handleDeleteHabit(habitid) {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/habits/deletehabit/${habitid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Habit deleted successfully");
      fetchHabits();
    } catch (error) {
      console.log("Error deleting habit:", error);
    }
  }

  async function handleDone(habitIndex, logIndex, date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0); // Normalize log date to midnight

    if (today.getTime() === logDate.getTime()) {
      const updatedHabits = habits.map((habit, hIndex) => {
        if (hIndex === habitIndex) {
          const updatedLogs = habit.logs.map((log, lIndex) => {
            if (lIndex === logIndex) {
              return { ...log, is_done: !log.is_done };
            }
            return log;
          });
          return { ...habit, logs: updatedLogs };
        }
        return habit;
      });

      setHabits(updatedHabits);

      const habitId = habits[habitIndex]?.id;
      const logId = habits[habitIndex]?.logs[logIndex]?.id;
      const isDone = !habits[habitIndex]?.logs[logIndex]?.is_done;
      console.log(
        `Updating habitId: ${habitId}, logId: ${logId}, isDone: ${isDone}`
      );

      try {
        const token = JSON.parse(localStorage.getItem("token"));
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/habits/habits/${habitId}/logs/${logId}`,
          { is_done: isDone },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Habit log updated successfully.");
      } catch (error) {
        console.error("Error updating habit log:", error);
        // Optionally, revert the optimistic update if the API call fails
      }
    } else {
      window.alert("You cannot change a date that is past today");
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900">
  <motion.h1
    className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400 flex items-center justify-center"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ClipboardDocumentCheckIcon className="h-10 w-10 md:h-12 md:w-12 mr-2" />
    Habit Tracker
  </motion.h1>

  <div className="flex flex-col md:flex-row items-center justify-end mb-8 pr-4 space-y-4 md:space-y-0 md:space-x-2">
    <div className="relative w-full md:w-auto">
      <select
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
        className="appearance-none p-3 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 pr-8 shadow-md w-full"
      >
        <option value="goal">Search by Goal</option>
        <option value="habit">Search by Habit Name</option>
      </select>
      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-4 w-4 text-gray-500 dark:text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.707a1 1 0 011.414 0L10 11.586l3.293-3.879a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>

    <div className="w-full md:w-64">
      <motion.input
        type="text"
        placeholder={`Search habits based on ${searchBy}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-3 w-full border-t border-b rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>

    <button
      onClick={() => handleSearch(searchQuery, searchBy)}
      className="bg-blue-600 text-white px-4 py-3 rounded-r hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-md w-full md:w-auto"
    >
      <MagnifyingGlassCircleIcon className="h-5 w-5" />
    </button>
  </div>

  {error && (
    <motion.div
      className="text-red-500 bg-red-100 p-4 rounded-md shadow-md mb-4 text-center dark:bg-red-900 dark:text-red-400"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {error}
    </motion.div>
  )}

  {habits.length > 0 ? (
    <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-1">
      {habits.map((habit) => (
        <motion.div
          key={habit.id}
          className="bg-white rounded-lg shadow-lg p-4 relative dark:bg-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <motion.button
              onClick={() => handleConfirmDeleteHabit(habit.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center dark:bg-red-700 dark:hover:bg-red-800"
              whileHover={{ scale: 1.05 }}
            >
              <TrashIcon className="h-5 w-5 mr-1" />
              Delete
            </motion.button>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-indigo-600 mb-2 dark:text-indigo-400">
            {habit.habit_name}
          </h2>
          <p className="text-gray-700 mb-1 dark:text-gray-300">
            <span className="font-semibold">Category:</span> {habit.category}
          </p>
          <p className="text-gray-700 mb-1 dark:text-gray-300">
            <span className="font-semibold">Target Frequency:</span> {habit.target_frequency}
          </p>
          <p className="text-gray-700 mb-1 dark:text-gray-300">
            <span className="font-semibold">Created At:</span> {new Date(habit.created_at).toLocaleString()}
          </p>
          <p className="text-gray-700 mb-4 dark:text-gray-300">
            <span className="font-semibold">Updated At:</span> {new Date(habit.updated_at).toLocaleString()}
          </p>
          <h3 className="text-lg font-semibold text-indigo-600 mb-2 dark:text-indigo-400">
            Logs for Current Week:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {habit.logs.map((log, logIndex) => {
              const date = new Date(log.date);
              const dayName = date.toLocaleDateString("en-US", {
                weekday: "long",
              });
              const dateString = date.toLocaleDateString();

              return (
                <motion.div
                  key={logIndex}
                  className={`flex flex-col items-center justify-center rounded p-2 shadow ${
                    log.is_done ? "bg-green-200 dark:bg-green-700" : "bg-red-200 dark:bg-red-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-gray-700 text-sm mb-1 break-words max-w-full dark:text-gray-300">{`${dayName} | ${dateString}`}</p>
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      handleDone(
                        habits.findIndex((h) => h.id === habit.id),
                        logIndex,
                        log.date
                      )
                    }
                  >
                    {log.is_done ? (
                      <CheckCircleIcon className="text-green-500 h-6 w-6" />
                    ) : (
                      <XCircleIcon className="text-red-500 h-6 w-6" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
    <p className="text-lg text-gray-500 text-center dark:text-gray-400">
      No habits found
    </p>
  )}

  <AddHabit
    open={openDialog}
    onClose={handleClose}
    onSave={handleAddHabit}
    title="Add New Habit +"
  >
    <div className="mb-4">
      <motion.input
        type="text"
        placeholder="Habit Name"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        className="p-3 w-full border rounded focus:outline-none focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
    <div className="mb-4">
      <motion.input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-3 w-full border rounded focus:outline-none focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
    </div>
    <div className="mb-4">
      <motion.input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-3 w-full border rounded focus:outline-none focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </div>
    <div className="mb-4">
      <motion.input
        type="text"
        placeholder="Target Frequency"
        value={targetFrequency}
        onChange={(e) => setTargetFrequency(e.target.value)}
        className="p-3 w-full border rounded focus:outline-none focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
    </div>
  </AddHabit>

  <div className="mt-4">
    <Footer />
  </div>

  <ConfirmationDialog
    isOpen={isDialogOpen}
    onConfirm={handleConfirmHabit}
    onClose={handleCloseHabit}
    message={"Are you sure you want to delete this habit"}
  />
</div>
  );
}
