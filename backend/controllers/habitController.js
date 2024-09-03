const Habits = require("../db/models/habits");
const Goals = require("../db/models/goals");
const moment = require("moment-timezone");
const { format, startOfWeek, endOfWeek } = require("date-fns");

const timeZone = "Asia/Kolkata"; // Time zone for India

// Function to filter logs for the current week
function filterLogsForCurrentWeek(logs) {
  // Get the current time in the India time zone
  const now = moment.tz(timeZone);

  // Get the start and end of the week in the India time zone
  const start = moment.tz(
    startOfWeek(now.toDate(), { weekStartsOn: 0 }),
    timeZone
  );
  const end = moment.tz(endOfWeek(now.toDate(), { weekStartsOn: 0 }), timeZone);

  // Convert start and end times to UTC for storage or further processing
  const startUtc = start.clone().utc();
  const endUtc = end.clone().utc();

  // Filter logs based on the week range
  return logs.filter((log) => {
    const logDate = moment.utc(log.date);
    return logDate.isBetween(startUtc, endUtc, null, "[]"); // inclusive range
  });
}

exports.addHabit = async (req, resp) => {
  const userId = req.user._id; // Changed here
  try {
    const { habit_name, description, category, target_frequency, goalid } =
      req.body;
    const existingHabits = await Habits.findOne({ habit_name, goalid });
    if (existingHabits) {
      return resp
        .status(400)
        .json({ message: "Habits already exist in the same goal" });
    }
    const newHabit = new Habits({
      user_id: userId,
      habit_name,
      description,
      category,
      goalid,
      target_frequency,
      logs: [],
    });
    const savedHabit = await newHabit.save();
    const goal = await Goals.findById(goalid);
    if (!goal) {
      return resp.status(404).json({ message: "Goal not found" });
    }
    goal.habits.push(savedHabit._id);
    await goal.save();
    resp.status(200).json(savedHabit);
  } catch (error) {
    resp
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getHabits = async (req, res) => {
  const userId = req.user._id; // Changed here
  try {
    const goals = await Goals.find({ user_id: userId, isArchived: false });
    const goalIds = goals.map((goal) => goal._id);

    const habits = await Habits.find({
      user_id: userId,
      goalid: { $in: goalIds },
    });

    const habitResponses = habits.map((habit) => ({
      id: habit._id,
      user_id: habit.user_id,
      habit_name: habit.habit_name,
      description: habit.description,
      category: habit.category,
      target_frequency: habit.target_frequency,
      created_at: habit.created_at.toISOString(),
      updated_at: habit.updated_at.toISOString(),
      goalid: habit.goalid,
      logs: filterLogsForCurrentWeek(habit.logs).map((log) => ({
        date: log.date.toISOString(),
        is_done: log.is_done,
        id: log._id,
      })),
      weekly_summary: habit.weekly_summary.map((weekly) => ({
        week_start: weekly.week_start.toISOString(),
        week_end: weekly.week_end.toISOString(),
        summary: weekly.summary,
        id: weekly._id,
      })),
      monthly_summary: habit.monthly_summary.map((monthly) => ({
        month_start: monthly.month_start.toISOString(),
        month_end: monthly.month_end.toISOString(),
        summary: monthly.summary,
      })),
    }));

    res.status(200).json(habitResponses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteHabit = async (req, res) => {
  const userId = req.user._id; // Changed here
  try {
    const habitId = req.params.habitId;
    const habit = await Habits.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    console.log(habit);
    console.log(userId);
    if (habit.user_id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to delete this habit",
      });
    }

    const goal = await Goals.findById(habit.goalid);
    if (goal) {
      goal.habits.pull(habit._id);
      await goal.save();
    }

    await habit.deleteOne({ _id: habitId });
    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.updateHabitLog = async (req, resp) => {
  try {
    const { habitId, logId } = req.params;
    const { is_done } = req.body;
    const updatedIsDone = Boolean(is_done);
    const habit = await Habits.findOneAndUpdate(
      { _id: habitId, "logs._id": logId },
      { $set: { "logs.$.is_done": updatedIsDone } },
      { new: true }
    );
    if (habit) {
      resp.status(200).json({ message: "Done" });
    } else {
      resp.status(404).json({ message: "Habit or log not found" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
exports.searchHabits = async (req, res) => {
  const userId = req.user._id;
  try {
    const { searchQuery, searchBy } = req.params;

    // Normalize the search query
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    if (searchBy === "goal") {
      // Search for goals that match the search query
      const goals = await Goals.find({
        user_id: userId,
        isArchived: false,
        target: { $regex: normalizedSearchQuery, $options: "i" },
      });

      if (goals.length === 0) {
        res.status(404).json({ message: "No goals found" });
        return;
      }

      // Extract the IDs of the found goals
      const goalIds = goals.map((goal) => goal._id);

      // Find habits that are associated with the found goals
      const habits = await Habits.find({
        user_id: userId,
        goalid: { $in: goalIds },
      });

      if (habits.length === 0) {
        res
          .status(404)
          .json({ message: "No habits found for the matched goals" });
        return;
      }

      // Map the habits to the response format
      const habitResponses = habits.map((habit) => ({
        id: habit._id,
        user_id: habit.user_id,
        habit_name: habit.habit_name,
        description: habit.description,
        category: habit.category,
        target_frequency: habit.target_frequency,
        created_at: habit.created_at.toISOString(),
        updated_at: habit.updated_at.toISOString(),
        goalid: habit.goalid,
        logs: filterLogsForCurrentWeek(habit.logs).map((log) => ({
          date: log.date.toISOString(),
          is_done: log.is_done,
          id: log._id,
        })),
        weekly_summary: habit.weekly_summary.map((weekly) => ({
          week_start: weekly.week_start.toISOString(),
          week_end: weekly.week_end.toISOString(),
          summary: weekly.summary,
          id: weekly._id,
        })),
        monthly_summary: habit.monthly_summary.map((monthly) => ({
          month_start: monthly.month_start.toISOString(),
          month_end: monthly.month_end.toISOString(),
          summary: monthly.summary,
        })),
      }));

      res.status(200).json(habitResponses);
    } else if (searchBy === "habit") {
      // Search for habits directly by name
      const habits = await Habits.find({
        user_id: userId,
        habit_name: { $regex: normalizedSearchQuery, $options: "i" },
      });

      if (habits.length === 0) {
        res.status(404).json({ message: "No habits found" });
        return;
      }

      const habitResponses = habits.map((habit) => ({
        id: habit._id,
        user_id: habit.user_id,
        habit_name: habit.habit_name,
        description: habit.description,
        category: habit.category,
        target_frequency: habit.target_frequency,
        created_at: habit.created_at.toISOString(),
        updated_at: habit.updated_at.toISOString(),
        goalid: habit.goalid,
        logs: filterLogsForCurrentWeek(habit.logs).map((log) => ({
          date: log.date.toISOString(),
          is_done: log.is_done,
          id: log._id,
        })),
        weekly_summary: habit.weekly_summary.map((weekly) => ({
          week_start: weekly.week_start.toISOString(),
          week_end: weekly.week_end.toISOString(),
          summary: weekly.summary,
          id: weekly._id,
        })),
        monthly_summary: habit.monthly_summary.map((monthly) => ({
          month_start: monthly.month_start.toISOString(),
          month_end: monthly.month_end.toISOString(),
          summary: monthly.summary,
        })),
      }));

      res.status(200).json(habitResponses);
    } else {
      res.status(400).json({ message: "Invalid search type" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
