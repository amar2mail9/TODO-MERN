import mongoose, { Schema, model } from "mongoose";
const subTodoSchema = new Schema(
  {
    taskName: { type: String, required: true, lowercase: true, unique: true },
    color: { type: String, default: "#ffffff" }, // Background color
    textColor: { type: String, default: "#000000" }, // 🔥 Add this for text color
    mainTodo: {
      type: Schema.Types.ObjectId,
      ref: "MainTodo",
      required: true,
    },
    comment: { type: String, default: "" },
    complete: { type: Boolean, default: false },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SubTodo = model("SubTodo", subTodoSchema);
