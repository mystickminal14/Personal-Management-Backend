import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    birthDate: {
      type: String,
      required:false,
      index: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Others"],
        message: `{VALUE} is not supported`,
      },
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
      index: true,
      maxlength: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!!"],
      trim: true,
      index: true,
      minlength: [8, `Password must be at least 8 characters, got {VALUE}`],
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
