import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true,
  },
});

const imageSchema = new mongoose.Schema({
  images: {
    type: String,
    required: true,
    trim: true,
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: [statusSchema],
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
    },
    images: [imageSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model('Task', taskSchema);
