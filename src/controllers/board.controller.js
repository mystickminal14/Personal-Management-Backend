import { Board } from "../models/boards.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloud } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const create = asyncHandler(async (req, res) => {
  const { boardName, description, startDate, endDate, taskStatus=[], status } =
    req.body;

  if (
    [boardName, description, startDate, endDate, status].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }
  if (!taskStatus) {
    throw new ApiError(400, "Task Status is required");
  }
  const UserId = req.user?._id;
  if (!UserId) {
    throw new ApiError(401, "Invalid Access Token");
  }

  const backgroundLocalPath = req.file?.path;
  let backgroundUrl = "";
  if (backgroundLocalPath) {
    const backgroundImg = await uploadCloud(backgroundLocalPath);
    backgroundUrl = backgroundImg?.url || "";
  }

  const board = await Board.create({
    boardName,
    description,
    startDate,
    endDate,
    background: backgroundUrl,
    createdBy: UserId,
    status,
    taskStatus:taskStatus.map((statusItem) => ({ status: statusItem }))
  });
 

  return res
    .status(200)
    .json(new ApiResponse(200, board, "Task Board Successfully Added!!"));
});

const retrieve = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Invalid Access Token");
  }

  const boards = await Board.find({
    $and: [{ createdBy: userId }, { isDeleted: false }],
  });
  if (!boards) {
    throw new ApiError(400, "No Records found!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, boards, "Data Retrieved Successfully!!"));
});

const getLatestBoard = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Invalid Access Token");
  }

  const latestBoard = await Board.findOne({
    $and: [{ createdBy: userId }, { status: "Active" }, { isDeleted: false }],
  })
    .sort({ createdAt: -1 })
    .exec();

  return res
    .status(200)
    .json(
      new ApiResponse(200, latestBoard, "Latest Board Retrieved Successfully")
    );
});

const view = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    throw new ApiError(401, "Invalid Board Id");
  }

  const latestBoard = await Board.find({ _id: id });

  return res
    .status(200)
    .json(new ApiResponse(200, latestBoard, " Board Retrieved Successfully"));
});

const drop = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Board ID is required");
  }
  const data = await Board.findByIdAndDelete({ _id: id });
  if (!data) {
    throw new ApiError(400, `Board does not exist!!`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Board Deleted Successfully"));
});
const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Board ID is required");
  }

  const { boardName, description, startDate, endDate, status } = req.body;

  if (
    [boardName, description, startDate, endDate, status].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }

  const updatedData = await Board.findByIdAndUpdate(
    id, // Pass the ID directly
    {
      $set: { boardName, description, startDate, endDate, status },
    },
    { new: true } // Return the updated document
  );

  if (!updatedData) {
    throw new ApiError(404, "Board not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedData, "Board updated successfully!!"));
});

const updateBackground = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Board ID is required");
  }
  const fileLocalPath = req.file?.path;
  if (!fileLocalPath) {
    throw new ApiError(400, "Background Image file is missing");
  }
  const background = await uploadCloud(fileLocalPath);
  if (!background.url) {
    throw new ApiError(400, "Error while updating the file");
  }
  const data = await Board.findByIdAndUpdate(
    { _id: id },
    {
      $set: { background: background.url },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Background Image updated successfully"));
});
const deleted = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new ApiError(401, "Invalid Access Token");
  }

  const data = await Board.find({
    $and: [{ createdBy: userId }, { status: "Inactive" }],
  });
  return res
    .status(200)
    .json(new ApiResponse(200, data, "BoardData deleted Successfully!!"));
});

export {
  create,
  retrieve,
  view,
  drop,
  deleted,
  update,
  updateBackground,
  getLatestBoard,
};
