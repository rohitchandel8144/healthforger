const nodeCron = require("node-cron");
const moment = require("moment-timezone");
const Habits = require("../db/models/habits");
const Goals = require("../db/models/goals");

// Utility functions
const getCurrentDate = () => {
  return moment().tz("Asia/Kolkata").startOf("day").toDate();
};

const getFormattedTimestamp = () => {
  return moment().tz("Asia/Kolkata").format();
};

const formatLogDate = (date) => {
  return moment(date).tz("Asia/Kolkata").format("YYYY-MM-DD");
};

// Habit service function
const updateDailyHabitLogs = async () => {
  try {
    const goals = await Goals.find({ isArchived: false });
    const habitIds = [];
    goals.forEach((goal) => habitIds.push(...goal.habits));
    // console.log(habitIds);-
    const habits = await Habits.find({ _id: { $in: habitIds } });
    // console.log(habits);
    // console.log(`Fetched habits: ${JSON.stringify(habits.map(habit => habit._id))}`);
    const today = getCurrentDate();
    const todayFormatted = formatLogDate(today);
    // console.log(`Today's date (formatted): ${todayFormatted}`);
    // console.log(`Today's date (raw): ${today}`);

    await Promise.all(
      habits.map(async (habit) => {
        const logDates = habit.logs.map((log) => formatLogDate(log.date));
        // console.log(`Log dates for habit ${habit._id}: ${logDates}`);

        if (!logDates.includes(todayFormatted)) {
          habit.logs.push({
            date: today,
            is_done: false,
          });
          await habit.save();
          // console.log(`Updated habit ${habit._id} with new log for date ${todayFormatted}`);
        } else {
          // console.log(`Habit ${habit._id} already has a log for today ${todayFormatted}`);
        }
      })
    );

    // console.log("Daily habit logs updated successfully");
  } catch (error) {
    console.error(`Error updating daily habit logs: ${error}`);
  }
};

// Schedule the cron job
const startCronJob = () => {
  nodeCron.schedule(
    "*/5 * * * * *", // Run at midnight every day
    async () => {
      const logMessageContent = `Cron job started at ${getFormattedTimestamp()}`;
      // console.log(logMessageContent);

      await updateDailyHabitLogs();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports = {
  startCronJob,
};
