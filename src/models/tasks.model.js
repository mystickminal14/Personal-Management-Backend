import mongoose from "mongoose";
const statusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true,
  },
  taskId: {
    type: mongoose.Schema.Type.ObjectId,
    ref: "Task",
  },
});
const imageSchema = new mongoose.Schema({
  images: {
    type: String,
    required: true,
    trim: true,
  },
  taskId: {
    type: mongoose.Schema.Type.ObjectId,
    ref: "Task",
  },
});
const subTaskSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Type.ObjectId,
    ref: "Task",
  },
  title: {
    type: String,
    required: true,
    trim: "",
  },
  status: {
    type: String,
    required: true,
    trim: "",
  },
  description: {
    type: String,
    required: true,
    trim: "",
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
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: "",
    },
    status: [statusSchema],
    description: {
      type: String,
      required: true,
      trim: "",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
    },
    images: [imageSchema],
    subTasks: [subTaskSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const Task= new mongoose.model('Task',taskSchema)