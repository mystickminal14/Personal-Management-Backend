
import mongoose from "mongoose";
const subTaskSchema = new mongoose.Schema({
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  });
  
export const Subtask = mongoose.model('Subtask', subTaskSchema);