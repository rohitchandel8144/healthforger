const express = require("express");
const {
  addHabit,
  getHabits,
  deleteHabit,
  updateHabitLog,
  searchHabits,
} = require("../controllers/habitController");
const router = express.Router();

router.post("/addhabits", addHabit);
router.get("/habits", getHabits);
router.delete("/deletehabit/:habitId", deleteHabit);
router.patch("/habits/:habitId/logs/:logId", updateHabitLog);
router.get("/getSearchHabits/:searchQuery/:searchBy", searchHabits);

module.exports = router;
