import { User } from "../models/users.model.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloud } from "../utils/fleUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const store = asyncHandler(async (req, res) => {
  const { fullName, birthDate, gender, username, email, password, avatar } =
    req.body;
  if (
    [fullName, birthDate, gender, username, email].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All the fields are required!!");
  }
  const userExists = User.findOne({ or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const avatarImg = await uploadCloud(avatarLocalPath);
  const user= await User.create({
    fullName,
    avatar: avatarImg?.url||"",
    gender,
    username,
    email,
    password,
  });
const createdUser=await User.findById(user._id).select(
  "-password -refreshToken"
)
if(!createdUser){
  throw new ApiError(500,"Something went wrong while registering the user!!")
}
return res.status(201).json(new ApiResponse(200,createdUser,"User Registered Successfully!!"));
});

export { store };
