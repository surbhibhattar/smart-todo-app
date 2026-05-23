const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: String,
    isCompleted: {
      type: Boolean,
      default: false,
    },
    dueDate: Date,
    completedAt: Date,
    order: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);