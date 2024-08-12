import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloud } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/tasks.model.js";

const store = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    dueDate,
    priority,
    boardId,
status
  } = req.body;

  if (
    [title, description, dueDate,status, priority].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }

  if (!boardId) {
    throw new ApiError(400, "Board id is required");
  }

  const save = await Task.create({
    title,
    description,
    dueDate,
    priority,
    boardId,
    status,
  });

  const data = await Task.findById(save._id).populate("status");

  res.status(200).json(new ApiResponse(200, data, "Task saved successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    dueDate,
    priority,
    boardId,
    status ,
  } = req.body;

  if (
    [title, description, dueDate, priority].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }

  if (!boardId) {
    throw new ApiError(400, "Board id is required");
  }
  if (!id) {
    throw new ApiError(400, "Task id is required");
  }

  const save = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      dueDate,
      priority,
      boardId,
      status,
    },
    { new: true }
  );

  const data = await Task.findById(save._id);

  res.status(200).json(new ApiResponse(200, data, "Task updated successfully"));
});

const retrieveTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Task id is required");
  }
  const retrieve = await Task.find({ boardId: id });

  res
    .status(200)
    .json(new ApiResponse(200, retrieve, "Tasks retrieved successfully"));
});

const viewTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Task id is required");
  }
  const retrieve = await Task.findOne({ _id: id });
  res
    .status(200)
    .json(new ApiResponse(200, retrieve, "Task retrieved successfully"));
});

const dropTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Task id is required");
  }
  await Task.findByIdAndDelete({ _id: id });

  res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
});


const updateStatus = asyncHandler(async (req, res) => {
  const { id, statusId } = req.params;
  const { status } = req.body;
  if (!status) {
    throw new ApiError(400, "Status is required");
  }
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  const statusToUpdate = task.status.id(statusId);
  if (!statusToUpdate) {
    throw new ApiError(404, "Status not found");
  }
  statusToUpdate.status = status;
  await task.save();
  res
    .status(200)
    .json(new ApiResponse(200, task, "Status updated successfully"));
});

const deleteStatus = asyncHandler(async (req, res) => {
  const { id, statusId } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  const result = await Task.updateOne(
    { _id: id },
    { $pull: { status: { _id: statusId } } }
  );

  if (result.nModified === 0) {
    throw new ApiError(404, "Status not found");
  }

 
  res.status(200).json(new ApiResponse(200,{}, "Status deleted successfully"));
});


export {
  store,
  viewTask,
  retrieveTask,
  dropTask,
  updateTask,
  updateStatus,
  deleteStatus,
};
