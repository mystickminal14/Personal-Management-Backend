import { User } from "../models/users.model.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloud } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from 'jsonwebtoken';

const generateAccessAndRefresh = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, "Error while generating token");
  }
};

const store = asyncHandler(async (req, res) => {
  const { fullName, birthDate, gender, username, email, password, avatar } = req.body;

  if ([fullName, birthDate, gender, username, email].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!!");
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.file?.path;
  let avatarUrl = "";
  if (avatarLocalPath) {
    const avatarImg = await uploadCloud(avatarLocalPath);
    avatarUrl = avatarImg?.url || "";
  }

  const user = await User.create({ fullName, avatar: avatarUrl, gender, username, email, password });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user!!");
  }

  return res.status(200).json(new ApiResponse(200, createdUser, "User Registered Successfully!!"));
});

const login = asyncHandler(async (req, res) => {
  const {  username, password } = req.body;

  if (!username) {
    throw new ApiError(400, "Username or Email is required!!");
  }

  const user = await User.findOne({ $or: [{ email:username }, { username:username }] });
  if (!user) {
    throw new ApiError(401, "User does not exist!");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect!!");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefresh(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  return res.status(200).json(new ApiResponse(200, { user: loggedInUser, refreshToken, accessToken }, "Login Successful!!"));
});

const logOut=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,
    {
      $set:{refreshToken:undefined}
    },
    {
      new:true
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200).
  clearCookie("accessToken",options).
  clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User Logged out Successfully!!"))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingToken= req.cookies?.refreshToken ||req.body.refreshToken
  if(!incomingToken){
    throw new ApiError(401,"Unauthorized Request")
  }
 try {
   const decodedToken=jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET)
   const user= await User.findById(decodedToken?._id)
   if(!user){
     throw new ApiError(401,"Invalid Refresh Token")
   }
   if(incomingToken !==user?.refreshToken){
     throw new ApiError(401," Refresh Token is already on used or expired")
   }
   const options={
     httpOnly:true,
     secure:true
   }
  const {accessToken,newRefreshToken} =await generateAccessAndRefresh(user._id)
   return res.status(200).cookies("accessToken",accessToken,options).cookies("refreshToken",newRefreshToken,options).json(new ApiResponse(200,{accessToken,newRefreshToken},"Access Token refreshed successfully!!"))
 
 
 } catch (error) {
  throw new ApiError(401,'Error in decoding token!')
 }})

export { store, login,logOut,refreshAccessToken };
