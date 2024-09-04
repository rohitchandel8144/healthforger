const User = require("../db/models/user");
const Habit = require("../db/models/habits");
const Goal = require("../db/models/goals");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (erorr) {
    res.status(500).json({ message: erorr.message });
  }
};

exports.deleteUser = async (req, res) => {

  const userId = req.params.userId;
  try {
    // Step 1: Find and delete all habits related to the user
    const habits = await Habit.find({ user_id: userId }).exec();
    const habitIds = habits.map((habit) => habit._id);

    // Delete related goals first to maintain referential integrity
    await Goal.deleteMany({ habits: { $in: habitIds } }).exec();

    // Delete habits
    await Habit.deleteMany({ user_id: userId }).exec();

    // Step 2: Find and delete all goals related to the user
    await Goal.deleteMany({ user_id: userId }).exec();

    // Step 3: Delete the user document
    await User.findByIdAndDelete(userId).exec();

    res
      .status(200)
      .json({ message: "User and related data successfully deleted." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user." });
  }
};
