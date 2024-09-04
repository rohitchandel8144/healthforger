const express = require("express");
const {
  overview,
  habitTrends,
  goalProgress,
  categoryBreakdown,
  getWeeklySummary,
  getMonthlySummary,
  getMilestones,
  getBestWorstDays,
  getWeekVsMonthPerformance,
  getNotificationsHandler
} = require("../controllers/progressController");
const router = express.Router();


router.get("/overview", overview);
router.get("/habitTrends", habitTrends);
router.get("/goalProgress", goalProgress);
router.get("/categoryBreakdown", categoryBreakdown);
router.get("/weeklySummary", getWeeklySummary);
router.get("/monthlySummary", getMonthlySummary);
router.get("/milestones", getMilestones);
router.get("/bestWorstDays",getBestWorstDays);
router.get('/weeklyVsMonthlyPerformance',getWeekVsMonthPerformance);
router.get('/getNotification',getNotificationsHandler)

module.exports = router;
