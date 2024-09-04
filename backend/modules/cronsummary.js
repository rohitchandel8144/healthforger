const nodeCron = require("node-cron");
const moment = require("moment-timezone");
const Habits = require("../db/models/habits");
const Goals = require("../db/models/goals");
const habits = require("../db/models/habits");

const scheduleCronJobs = () => {
  // Weekly summary cron job
  nodeCron.schedule(
    "*/5 * * * * *",
    async () => {
      // Runs every Sunday at midnight
      // console.log(`Weekly summary job started at ${moment().tz('Asia/Kolkata').format()}\n`);

      try {
        const goals = await Goals.find({ isArchived: false });
        // console.log("found goals", goals);

        const habitIds = [];

        goals.forEach((goal) => habitIds.push(...goal.habits));

        const habits = await Habits.find({ _id: { $in: habitIds } });
        // console.log(`Found ${habits.length} habits\n`);
        for (const habit of habits) {
          const weekEnd = moment().tz("Asia/Kolkata").endOf("week").toDate(); // End of the current week (Sunday)
          const weekStart = moment(weekEnd)
            .subtract(6, "days")
            .startOf("day")
            .toDate(); // Start of the week (Monday)
          // console.log(`Processing habit ${habit._id} for week ${weekStart} to ${weekEnd}\n`);

          const weeklyLogs = habit.logs.filter((log) =>
            moment(log.date).isBetween(weekStart, weekEnd, null, "[]")
          );
          // console.log(`Found ${weeklyLogs.length} logs for the week\n`);

          const completedDays = weeklyLogs.filter((log) => log.is_done).length;
          const totalDays = 7; // There are always 7 days in a week
          const summary = `Completed ${completedDays} out of ${totalDays} days`;
          // console.log(`Summary: ${summary}\n`);

          // Check if the last weekly summary entry is for the current week
          const lastSummary =
            habit.weekly_summary[habit.weekly_summary.length - 1];

          if (
            lastSummary &&
            moment(lastSummary.week_end).isSame(weekEnd, "day")
          ) {
            // console.log(`Weekly summary for ${weekStart} to ${weekEnd} already exists. Checking for changes.\n`);

            if (summary !== lastSummary.summary) {
              // console.log(`Updating existing weekly summary for ${weekStart} to ${weekEnd}\n`);
              lastSummary.summary = summary;
              lastSummary.week_start = weekStart;
              lastSummary.week_end = weekEnd;
              await habit.save();
            } else {
              // console.log(`No changes in logs. Skipping weekly summary update.\n`);
            }
          } else {
            // console.log(`Adding new weekly summary for ${weekStart} to ${weekEnd}\n`);
            // Push a new weekly summary entry
            habit.weekly_summary.push({
              week_start: weekStart,
              week_end: weekEnd,
              summary,
            });
            await habit.save();
          }
        }

        // console.log('Weekly summaries updated successfully\n');
      } catch (error) {
        // console.log(`Error updating weekly summaries: ${error.message}\n`);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  // Monthly summary cron job
  nodeCron.schedule(
    "*/5 * * * * *",
    async () => {
      // Runs at midnight on the first day of every month
      // console.log(`Monthly summary job started at ${moment().tz('Asia/Kolkata').format()}\n`);

      try {
        const habits = await Habits.find();
        // console.log(`Found ${habits.length} habits\n`);

        for (const habit of habits) {
          const monthEnd = moment().tz("Asia/Kolkata").endOf("month").toDate();
          const monthStart = moment(monthEnd).startOf("month").toDate();
          // console.log(`Processing habit ${habit._id} for month ${monthStart} to ${monthEnd}\n`);

          const monthlyLogs = habit.logs.filter((log) =>
            moment(log.date).isBetween(monthStart, monthEnd, null, "[]")
          );
          // console.log(`Found ${monthlyLogs.length} logs for the month\n`);

          const completedDays = monthlyLogs.filter((log) => log.is_done).length;
          const totalDays = moment(monthEnd).diff(monthStart, "days") + 1; // Correctly calculate the total days in the month
          const summary = `Completed ${completedDays} out of ${totalDays} days`;
          // console.log(`Summary: ${summary}\n`);

          // Check if the last monthly summary entry is for the current month
          const lastSummary =
            habit.monthly_summary[habit.monthly_summary.length - 1];

          if (
            lastSummary &&
            moment(lastSummary.month_end).isSame(monthEnd, "day")
          ) {
            // console.log(`Monthly summary for ${monthStart} to ${monthEnd} already exists. Checking for changes.\n`);

            if (summary !== lastSummary.summary) {
              // console.log(`Updating existing monthly summary for ${monthStart} to ${monthEnd}\n`);
              lastSummary.summary = summary;
              lastSummary.month_start = monthStart;
              lastSummary.month_end = monthEnd;
              await habit.save();
            } else {
              // console.log(`No changes in logs. Skipping monthly summary update.\n`);
            }
          } else {
            // console.log(`Adding new monthly summary for ${monthStart} to ${monthEnd}\n`);
            // Push a new monthly summary entry
            habit.monthly_summary.push({
              month_start: monthStart,
              month_end: monthEnd,
              summary,
            });
            await habit.save();
          }
        }

        // console.log('Monthly summaries updated successfully\n');
      } catch (error) {
        // console.log(`Error updating monthly summaries: ${error.message}\n`);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports = scheduleCronJobs;
