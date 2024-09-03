const Goals = require("../db/models/goals");
const Habits = require("../db/models/habits");

exports.setGoals = async (req, resp) => {
  try {
    const { target } = req.body;
    const existingGoal = await Goals.findOne({ target });
    if (existingGoal) {
      return resp.status(400).json({ message: "goal already exists" });
    }
    let goal = new Goals(req.body);
    let result = await goal.save();
    resp.status(200).json("ok");
  } catch (error) {
    resp
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.getGoals = async (req, resp) => {
 
  try {
    // Fetch all goals for the user
   
    const goals = await Goals.find({ user_id: req.user._id }).populate(
      "habits"
    );
    // Filter out archived goals
    const unarchivedGoals = goals.filter((goal) => goal.isArchived === false);
    // Respond with the unarchived goals
    resp.status(200).json(unarchivedGoals);
  } catch (error) {
    resp
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goalid = req.params.goalId;
    const goal = await Goals.findById(goalid);
    if (!goal) {
      return res.status(404).json({ message: "goals not found" });
    }
    const habits = await Habits.deleteMany({ goalid: goalid });
    await Goals.deleteOne({ _id: goalid });
    
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.archiveGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const goal = await Goals.findOneAndUpdate(
      { _id: goalId },
      { $set: { isArchived: true } },
      { new: true }
    );
    if (goal) {
      res.status(200).json({ message: "done" });
    } else {
      res.status(404).json({ message: "goal not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.showarchive = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const goals = await Goals.find({
      user_id: userId,
      isArchived: true,
    }).populate("habits");

    res.status(200).json(goals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
