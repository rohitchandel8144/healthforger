import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
  TrophyIcon,
  ArrowDownCircleIcon,
  ArchiveBoxIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/solid";
import AddGoal from "../components/AddGoals";
import AddHabit from "../components/AddHabit";
import { useNavigate } from "react-router-dom";
import CircularProgressBar from "../components/CircularProgressBar";
import Footer from "../components/Footer";
import ConfirmationDialog from "../components/ConfirmationDialog";
import PaymentForm from "../components/PaymentForm";
import { useLoading } from "../context/LoadingContext";
import Loader from "../components/Loader";

export default function GoalSetting() {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const { loading, showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    target: "",
    deadline: "",
    description: "",
  });

  const navigate = useNavigate();
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [targetFrequency, setTargetFrequency] = useState("");
  const [selectId, setSelectedId] = useState(null);
  const [goalIdToDelete, SetGoalIdToDelete] = useState(null);

  const fetchGoals = async () => {
    showLoading();
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/goals/getgoals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGoals(response.data);
      // console.log("Fetched goals:", response.data);
    } catch (error) {
      setError(error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddHabit = async () => {
    try {
      if (!habitName || !description || !targetFrequency || !category) {
        alert("Please fill out all the fields");
        return;
      }
      const token = JSON.parse(localStorage.getItem("token"));
      const newHabitData = {
        habit_name: habitName,
        description: description,
        category: category,
        target_frequency: targetFrequency,
        goalid: selectId,
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

      // console.log("Habit added successfully:", response.data);
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === selectId
            ? { ...goal, habits: [...goal.habits, response.data] }
            : goal
        )
      );
      fetchGoals();
      setHabitName("");
      setDescription("");
      setCategory("");
      setTargetFrequency("");
      setOpenDialog2(false);
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      }
      console.error("Error adding habit:", error);
    }
  };

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleOpen2 = (goalid) => {
    setSelectedId(goalid);
    setOpenDialog2(true);
  };

  const handleClose2 = () => {
    setOpenDialog2(false);
  };

  const handleAddGoal = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveGoals = async () => {
    try {
      if (!formData.target || !formData.deadline || !formData.description) {
        alert("Please fill all the fields");

        return;
      }
      // Convert formData.deadline to a Date object
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        alert("Deadline cannot be set to a past date.");
        return;
      }

      const token = JSON.parse(localStorage.getItem("token"));
      const user_id = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/goals/setgoals`,
        {
          ...formData,
          user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Goal saved successfully:", response.data);
      setGoals((prevGoals) => [...prevGoals, response.data]);
      handleClose();
      fetchGoals();
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      }
      console.log("Error setting goals", error);
    }
  };

  const manageHabits = () => {
    navigate("/habittracker");
  };

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error: {error.message}
      </div>
    );
  }

  function ConfirmDeleteGoal(goalId) {
    setIsDialogOpen(true);
    console.log(goalId);
    SetGoalIdToDelete(goalId);
  }

  function handleConfirmDelete() {
    handleDeleteConfirm(goalIdToDelete);
    setIsDialogOpen(false);
  }

  function handleDeleteClose() {
    setIsDialogOpen(false);
  }

  async function handleDeleteConfirm(goalId) {
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
      console.log("Deleting successful");
      fetchGoals();
    } catch (error) {
      console.log("Error deleting goals", error);
    }
  }

  const calculateProgress = (habit) => {
    if (!habit.weekly_summary || habit.weekly_summary.length === 0) return "0%";
    let index = habit.weekly_summary.length - 1;
    const summaryText = habit.weekly_summary[index].summary;
    const [completed, total] = summaryText.match(/\d+/g).map(Number); // Extract numbers and convert to numbers
    if (total === 0) return "0%"; // Handle division by zero or invalid data
    const progress = (completed / total) * 100;
    return Math.round(progress);
  };

  const calculateProgress2 = (habit) => {
    if (!habit.monthly_summary || habit.monthly_summary.length === 0)
      return "0%";
    let index = habit.monthly_summary.length - 1;
    const summaryText = habit.monthly_summary[index].summary;
    const [completed, total] = summaryText.match(/\d+/g).map(Number); // Extract numbers and convert to numbers
    if (total === 0) return "0%"; // Handle division by zero or invalid data
    const progress = (completed / total) * 100;
    return Math.round(progress);
  };

  function checkDeadline(deadline) {
    let today = new Date();
    let deadlineDate = new Date(deadline);
  
    // console.log("Today:", today.toLocaleDateString());
    // console.log("Deadline:", deadlineDate.toLocaleDateString());
    
    if (today < deadlineDate) {
      return deadlineDate.toLocaleDateString();
    } else {
      return "Hooray, your goal is completed!";
    }
  }
  
  async function handleArchive(goalId) {
    console.log(goalId);
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/goals/archivegoals/${goalId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Archived successfully.");
      fetchGoals();
    } catch (error) {
      console.error("Error archiving:", error);
    }
  }

  function navigateArchive() {
    navigate("/showarchive");
  }

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900  min-h-screen">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400 flex items-center justify-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TrophyIcon className="h-12 w-12 mr-2" />
        Goal-Setting
      </motion.h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={navigateArchive}
          className="flex items-center bg-green-600 text-white dark:bg-green-500 dark:text-black px-4 py-2 rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <ArchiveBoxIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-semibold">Show Archived</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <motion.button
          onClick={handleOpen}
          className="bg-blue-600 text-white dark:bg-blue-500 dark:text-black px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <PlusCircleIcon className="h-6 w-6 mr-2" />
          Add New Goal
        </motion.button>
      </div>

      {goals.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <motion.div
              key={goal._id}
              className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 relative hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => ConfirmDeleteGoal(goal._id)}
                  className="bg-red-600 text-white dark:bg-red-500 dark:text-black px-3 py-1 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition duration-300"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleOpen2(goal._id)}
                  className="bg-blue-600 text-white dark:bg-blue-500 dark:text-black px-3 py-1 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                </button>
              </div>

              <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">
                {goal.target}
              </h2>

              <p className="text-gray-700 dark:text-gray-300 mb-1">
                <span className="font-semibold">Description:</span>{" "}
                {goal.description}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-1">
                <span className="font-semibold">Deadline:</span>{" "}
                {checkDeadline(goal.deadline)}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-1 relative">
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(goal.createdAt).toLocaleString()}
                {new Date(goal.deadline) < new Date() && (
                  <div className="absolute top-20 right-2 flex space-x-2">
                    <button
                      onClick={() => handleArchive(goal._id)}
                      className="bg-green-600 text-white dark:bg-green-500 dark:text-black px-3 py-1 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition duration-300"
                    >
                      <ArrowDownCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <span className="font-semibold">Updated At:</span>{" "}
                {new Date(goal.updatedAt).toLocaleString()}
              </p>

              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                Habits
              </h3>

              <ul className="list-disc ml-4">
                {Array.isArray(goal.habits) && goal.habits.length > 0 ? (
                  goal.habits.map((habit) => (
                    <li key={habit._id} className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Habit Name:</span>{" "}
                        {habit.habit_name}
                      </p>
                      <div className="flex justify-evenly mt-4">
                        <div className="mt-2">
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">
                              Weekly Summary
                            </span>
                          </p>
                          <CircularProgressBar
                            percentage={calculateProgress(habit)}
                            size={120}
                          />
                        </div>

                        <div className="mt-2">
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">
                              Monthly Summary
                            </span>
                          </p>
                          <CircularProgressBar
                            percentage={calculateProgress2(habit)}
                            size={120}
                          />
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">
                    No habits available for this goal.
                  </p>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No goals available.
        </p>
      )}

      <motion.button
        className="bg-blue-600 text-white dark:bg-blue-500 dark:text-black px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 flex items-center justify-center mt-8"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={manageHabits}
      >
        Show Habits
      </motion.button>

     z
      <AddHabit
        open={openDialog2}
        onClose={handleClose2}
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

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleDeleteClose}
        message={"Are you sure you want to delete this goal"}
      />
      {loading && <Loader />}
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
}
