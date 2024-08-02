import { Board } from "../models/boards.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloud } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const create = asyncHandler(async (req, res) => {
  const { boardName, description, startDate, endDate, background, status } =
    req.body;

  if (
    [boardName, description, startDate, endDate, background, status].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
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

  const boards = await Board.find({ createdBy: userId });
  if (!boards) {
    throw new ApiError(400, "No Records found!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, boards, "Data Retrieved Successfully!!"));
});

const singleView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Board ID is required");
  }

  const data = await Board.findById(id);
  if (!data) {
    throw new ApiError(400, `Board does not exist!!`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Board Retrieved Successfully!!"));
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
  const { boardName, description, startDate, endDate, background, status } =
    req.body;

  if (
    [boardName, description, startDate, endDate, background, status].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }
  const updatedData = await Board.findByIdAndUpdate(
    { _id: id },
    { $set: { boardName, description, startDate, endDate, background, status } }
  );
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
export { create, retrieve, singleView, drop, update, updateBackground };
