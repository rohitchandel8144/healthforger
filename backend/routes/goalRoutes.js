const express = require("express");
const {
  setGoals,
  getGoals,
  deleteGoal,
  archiveGoal,
  showarchive,
} = require("../controllers/goalController");
const router = express.Router();

router.post("/setgoals",setGoals);
router.get("/getgoals", getGoals);
router.delete("/deletegoal/:goalId", deleteGoal);
router.patch("/archivegoals/:goalId", archiveGoal);
router.get("/showarchive", showarchive);

module.exports = router;
