import { Subtask } from "../models/subtask.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createSubTask = asyncHandler(async (req, res) => {
  const { taskId, title, status, description, dueDate } = req.body;
  if (!taskId) {
    throw new ApiError(400, "Task ID is required!");
  }

  if (
    [title, status, description, dueDate].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  const save = await Subtask.create({
    taskId,
    title,
    status,
    description,
    dueDate,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, save, "Subtask saved successfully!!"));
});
const dropSubTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Sub task id is required!!");
  }
  await Subtask.deleteOne({ _id: id });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Sub task deleted successfully!!"));
});


const retireveSubTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "TaskId id is required!!");
    }
    const data = await Subtask.find({ taskId: id });

    return res.status(200).json(new ApiResponse(200, data, "Subtask retrieved successfully!!"));
  });

const viewSubTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Sub task id is required!!");
  }
  const data = await Subtask.findOne({ _id: id });
  return res.status(200).json(new ApiResponse(200, data, "Subtask retrieved successfully!!"));
});
const editSubTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { taskId, title, status, description, dueDate } = req.body;
  if (!id) {
    throw new ApiError(400, "Sub task id is required!!");
  }
  if (!taskId) {
    throw new ApiError(400, "Task ID is required!");
  }
  if (
    [title, status, description, dueDate].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  const updatedData=await Subtask.findByIdAndUpdate({_id:id},{$set:{taskId, title, status, description, dueDate }})
  return res.status(200).json(new ApiResponse(200, updatedData, "Subtask updated successfully!!"));
});
export { createSubTask, dropSubTask, editSubTask, viewSubTask,retireveSubTask };
