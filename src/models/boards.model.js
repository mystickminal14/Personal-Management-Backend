import mongoose from "mongoose";
const statusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true,
  },
});
const boardSchema = new mongoose.Schema(
  {
    boardName: {
      type: String,
      required: true,
      trim: true,
    },
    background: {
      type: String,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message: "{VALUE} is not supported",
      },
      default: "Active",
      trim: true,
    },
    taskStatus:[statusSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Board = mongoose.model("Board", boardSchema);
