const Goals = require("../db/models/goals");
const Habits = require("../db/models/habits");
const moment = require("moment");
exports.overview = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get today's date in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00.000 UTC
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59.999 UTC

    // Total Goals
    const totalGoalsResult = await Goals.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $group: { _id: null, totalGoals: { $sum: 1 } } },
    ]);
    const totalGoals =
      totalGoalsResult.length > 0 ? totalGoalsResult[0].totalGoals : 0;

    // Total Habits
    const totalHabitsResult = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $group: { _id: null, totalHabits: { $sum: 1 } } },
    ]);
    const totalHabits =
      totalHabitsResult.length > 0 ? totalHabitsResult[0].totalHabits : 0;

    // Goal Status
    const goalStatusResult = await Goals.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $group: { _id: "$isArchived", count: { $sum: 1 } } },
    ]);
    const goalStatus = {
      archived:
        goalStatusResult.find((status) => status._id === true)?.count || 0,
      active:
        goalStatusResult.find((status) => status._id === false)?.count || 0,
    };

    // Habit Status
    const habitStatusResult = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      {
        $facet: {
          active: [
            {
              $match: {
                logs: {
                  $elemMatch: {
                    is_done: false,
                    date: { $gte: todayStart, $lte: todayEnd },
                  },
                }, // Check for incomplete logs for today
              },
            },
            { $count: "activeCount" },
          ],
          completed: [
            {
              $match: {
                logs: {
                  $elemMatch: {
                    is_done: true,
                    date: { $gte: todayStart, $lte: todayEnd },
                  },
                }, // Check for completed logs for today
              },
            },
            { $count: "completedCount" },
          ],
        },
      },
    ]);

    const activeCount = habitStatusResult[0]?.active[0]?.activeCount || 0;
    const completedCount =
      habitStatusResult[0]?.completed[0]?.completedCount || 0;

    const habitStatus = {
      active: activeCount,
      completed: completedCount,
    };

    const currentStreaksResult = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$logs" },
      { $sort: { "logs.date": -1 } },
      {
        $group: {
          _id: "$_id",
          habitName: { $first: "$habit_name" },
          streak: {
            $sum: {
              $cond: {
                if: { $eq: ["$logs.is_done", true] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      { $sort: { streak: -1 } },
    ]);

    res.send({
      totalGoals,
      totalHabits,
      goalStatus,
      habitStatus,
      currentStreaks: currentStreaksResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.habitTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    const habitTrends = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$logs" },
      { $match: { "logs.is_done": true } }, // Filter to only include completed logs
      {
        $addFields: {
          adjustedDate: {
            $dateAdd: {
              startDate: "$logs.date",
              unit: "minute",
              amount: 330, // Adjust for 5 hours 30 minutes (Asia/Kolkata is UTC+5:30)
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$adjustedDate" },
            month: { $month: "$adjustedDate" },
            day: { $dayOfMonth: "$adjustedDate" },
          },
          totalCompleted: { $sum: 1 }, // Count each log as completed
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    res.status(200).json(habitTrends);
  } catch (error) {
    console.error("Error fetching habit trends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.goalProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const goalProgress = await Goals.aggregate([
      { $match: { user_id: userId, isArchived: false } }, // Filter by user ID and active goals
      {
        $lookup: {
          from: "habits",
          localField: "_id",
          foreignField: "goalid",
          as: "habits",
        },
      },
      {
        $project: {
          description: 1,
          target: 1,
          completedHabits: { $size: "$habits.logs" },
        },
      },
      { $sort: { description: 1 } },
    ]);

    res.status(200).json(goalProgress);
  } catch (error) {
    console.error("Error fetching goal progress:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.categoryBreakdown = async (req, res) => {
  try {
    const userId = req.user._id;

    const categoryBreakdown = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(categoryBreakdown);
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to extract the number of completed tasks from the summary string
const extractCompletedTasks = (summary) => {
  const match = summary.match(/Completed (\d+) out of/);
  return match ? parseInt(match[1], 10) : 0;
};

exports.getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate the start and end of the current week
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    const weeklySummaries = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$weekly_summary" },
      {
        $match: {
          "weekly_summary.week_start": { $gte: startOfWeek },
          "weekly_summary.week_end": { $lte: endOfWeek },
        },
      },
      {
        $project: {
          _id: 0,
          summary: "$weekly_summary.summary",
        },
      },
    ]);

    const totalCompletedWeekly = weeklySummaries.reduce((total, item) => {
      return total + extractCompletedTasks(item.summary);
    }, 0);

    res.json({ totalCompleted: totalCompletedWeekly });
  } catch (error) {
    console.error("Error fetching weekly summary:", error);
    res.status(500).json({ error: "Failed to fetch weekly summary" });
  }
};

exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate the start and end of the current month
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const monthlySummaries = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$monthly_summary" },
      {
        $match: {
          "monthly_summary.month_start": { $gte: startOfMonth },
          "monthly_summary.month_end": { $lte: endOfMonth },
        },
      },
      {
        $project: {
          _id: 0,
          summary: "$monthly_summary.summary",
        },
      },
    ]);

    const totalCompletedMonthly = monthlySummaries.reduce((total, item) => {
      return total + extractCompletedTasks(item.summary);
    }, 0);

    res.json({ totalCompleted: totalCompletedMonthly });
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    res.status(500).json({ error: "Failed to fetch monthly summary" });
  }
};

exports.getMilestones = async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate the start of the current week to identify milestones from the current week onward
    const startOfWeek = moment().startOf("week").toDate();

    const milestones = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$logs" },
      {
        $match: {
          "logs.date": { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: "$user_id",
          firstConsistentWeek: { $min: "$logs.date" },
        },
      },
      {
        $project: {
          _id: 0,
          firstConsistentWeek: {
            $dateToString: { format: "%Y-%m-%d", date: "$firstConsistentWeek" },
          },
        },
      },
    ]);

    res.json(milestones[0] || { firstConsistentWeek: "N/A" });
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
};
exports.getBestWorstDays = async (req, res) => {
  try {
    const userId = req.user._id;

    const bestWorstDays = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$logs" },
      {
        $group: {
          _id: "$logs.date",
          totalCompleted: { $sum: 1 },
        },
      },
      { $sort: { totalCompleted: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(bestWorstDays);
  } catch (error) {
    console.error("Error fetching best/worst days:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getWeekVsMonthPerformance = async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate the start and end of the current week (assuming week starts on Sunday)
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    // Aggregating weekly summaries for the current week only
    const weeklySummaries = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$weekly_summary" },
      {
        $match: {
          "weekly_summary.week_start": { $gte: startOfWeek },
          "weekly_summary.week_end": { $lte: endOfWeek },
        },
      },
      {
        $project: {
          _id: 0,
          week_start: "$weekly_summary.week_start",
          week_end: "$weekly_summary.week_end",
          summary: "$weekly_summary.summary",
        },
      },
    ]);

    // Aggregating monthly summaries (no change needed for monthly)
    const monthlySummaries = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$monthly_summary" },
      {
        $project: {
          _id: 0,
          month_start: "$monthly_summary.month_start",
          month_end: "$monthly_summary.month_end",
          summary: "$monthly_summary.summary",
        },
      },
    ]);

    // Function to extract the number of completed tasks from the summary string
    const extractCompletedTasks = (summary) => {
      const match = summary.match(/Completed (\d+) out of/);
      return match ? parseInt(match[1], 10) : 0;
    };

    // Calculate total completed tasks from weekly summaries
    const totalCompletedWeekly = weeklySummaries.reduce((total, item) => {
      return total + extractCompletedTasks(item.summary);
    }, 0);

    // Calculate total completed tasks from monthly summaries
    const totalCompletedMonthly = monthlySummaries.reduce((total, item) => {
      return total + extractCompletedTasks(item.summary);
    }, 0);

    res.json({
      weeklySummary: { totalCompletedWeekly },
      monthlySummary: { totalCompletedMonthly },
    });
  } catch (error) {
    console.error("Error fetching week vs month performance:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch week vs month performance" });
  }
};

exports.getNotifications = async () => {
  try {
    const now = new Date();

    // Find upcoming deadlines within the next 7 days for all users
    const upcomingDeadlines = await Goals.aggregate([
      { $match: { deadline: { $gte: now }, isArchived: false } }, // Filter by deadlines and not archived
      {
        $match: {
          deadline: {
            $lte: moment().add(7, "days").toDate(), // Upcoming deadlines within the next 7 days
          },
        },
      },
      {
        $project: {
          user_id: 1, // Include user ID in the result
          description: 1,
          deadline: 1,
        },
      },
    ]);

    // Find missed habits for today for all users
    const missedHabits = await Habits.aggregate([
      { $unwind: "$logs" },
      {
        $match: {
          "logs.date": {
            $gte: moment().startOf("day").toDate(), // Logs from today
            $lte: moment().endOf("day").toDate(),
          },
          "logs.is_done": false, // Missed habits (not completed)
        },
      },
      {
        $group: {
          _id: "$_id",
          habit_name: { $first: "$habit_name" },
          user_id: { $first: "$user_id" }, // Include user ID in the result
        },
      },
      {
        $project: {
          user_id: 1, // Include user ID in the result
          habit_name: 1,
        },
      },
    ]);

    // Return notifications data
    return {
      upcomingDeadlines,
      missedHabits,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
};

exports.getNotificationsHandler = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user contains the authenticated user's data
    const now = new Date();

    // Find upcoming deadlines within the next 7 days
    const upcomingDeadlines = await Goals.aggregate([
      {
        $match: {
          user_id: userId, // Filter by user ID
          deadline: { $gte: now },
          isArchived: false,
        },
      },
      {
        $match: {
          deadline: {
            $lte: moment().add(7, "days").toDate(), // Upcoming deadlines within the next 7 days
          },
        },
      },
      {
        $project: {
          description: 1,
          deadline: 1,
        },
      },
    ]);

    // Find missed habits for today
    const missedHabits = await Habits.aggregate([
      { $match: { user_id: userId } }, // Filter by user ID
      { $unwind: "$logs" },
      {
        $match: {
          "logs.date": {
            $gte: moment().startOf("day").toDate(), // Logs from today
            $lte: moment().endOf("day").toDate(),
          },
          "logs.is_done": false, // Missed habits (not completed)
        },
      },
      {
        $group: {
          _id: "$_id",
          habit_name: { $first: "$habit_name" },
        },
      },
      {
        $project: {
          habit_name: 1,
        },
      },
    ]);
    res.send({
      upcomingDeadlines,
      missedHabits,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Failed to fetch notifications");
  }
};
