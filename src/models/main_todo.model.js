import mongoose, { Schema, model } from "mongoose";

// MainTodo Schema
const mainTodoSchema = new Schema(
  {
    title: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      trim: true,
      minlength: 2,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    textColor: {
      type: String,
      default: "#121212",
    },
  },
  { timestamps: true }
);

// Models
export const MainTodo = model("MainTodo", mainTodoSchema);
