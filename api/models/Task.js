// api/models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 50 },
    detail: { type: String, maxlength: 50 },
    date: { type: Date },
    time: { type: String },
    status: { 
      type: String, 
      enum: ["pendiente", "en-progreso", "completada"], 
      default: "pendiente" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
