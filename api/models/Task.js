const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
