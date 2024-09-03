const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const habitSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    habit_name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    target_frequency: { type: String },
    goalid: { type: Schema.Types.ObjectId, ref: "Goals", required: true },
    logs: [
      {
        date: { type: Date, required: true },
        is_done: { type: Boolean, default: false },
      },
    ],
    weekly_summary: [
      {
        week_start: { type: Date, required: true },
        week_end: { type: Date, required: true },
        summary: { type: String },
      },
    ],
    monthly_summary: [
      {
        month_start: { type: Date, required: true },
        month_end: { type: Date, required: true },
        summary: { type: String },
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // Mapping timestamps to custom field names
  }
);

module.exports = mongoose.model("Habits", habitSchema);
