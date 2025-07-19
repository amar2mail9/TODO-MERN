import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      lowercase: true,
      minlength: 3,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      trim: true,
      minlength: 8,
      match: /^[a-z0-9_]{8,}$/,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      trim: true,
      minlength: 8,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      required: true,
    },
    otp: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = model("User", userSchema);
