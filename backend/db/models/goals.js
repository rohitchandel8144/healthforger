const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalsSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    description: { type: String, required: true },
    target: { type: String, required: true },
    deadline: { type: Date, required: true },
    habits: [{ type: Schema.Types.ObjectId, ref: "Habits" }],
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Goals", goalsSchema);
