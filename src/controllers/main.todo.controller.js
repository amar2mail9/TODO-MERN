import slugify from "slugify";
import { MainTodo } from "../models/main_todo.model.js";

// ✅ CREATE
export const createMainTodo = async (req, res) => {
  try {
    const { title, color, textColor } = req.body;
    const user = req.user;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, error: "Title is required" });
    }

    const exist = await MainTodo.findOne({
      title: title.toLowerCase(),
      author: user._id,
    });
    if (exist) {
      return res.status(400).json({ success: false, error: "Already exists" });
    }

    const newTodo = await MainTodo.create({
      title,
      color,
      textColor,
      author: user._id,
      slug: slugify(title),
    });

    res
      .status(201)
      .json({ success: true, message: "MainTodo created", data: newTodo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ READ ALL
export const getAllMainTodo = async (req, res) => {
  try {
    const user = req.user;
    const todos = await MainTodo.find({ author: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ READ SINGLE
export const getSingleMainTodo = async (req, res) => {
  try {
    const todo = await MainTodo.findById(req.params.id);
    if (!todo)
      return res.status(404).json({ success: false, error: "Not found" });

    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ UPDATE
export const updateMainTodo = async (req, res) => {
  try {
    const { title, color, textColor } = req.body;
    const updated = await MainTodo.findByIdAndUpdate(
      req.params.id,
      { title, color, textColor },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, error: "Not found" });

    res.status(200).json({ success: true, message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ DELETE
export const deleteMainTodo = async (req, res) => {
  try {
    const deleted = await MainTodo.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, error: "Not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
