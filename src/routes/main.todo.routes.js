import express from "express";
import { verifyUser } from "../middlewares/middleware.js";
import {
  createMainTodo,
  getAllMainTodo,
  getSingleMainTodo,
  updateMainTodo,
  deleteMainTodo,
} from "../controllers/main.todo.controller.js";

export const mainTodoRoutes = express.Router();

// CREATE
mainTodoRoutes.post("/create/main-todo", verifyUser, createMainTodo);

// READ
mainTodoRoutes.get("/main-todos", verifyUser, getAllMainTodo);
mainTodoRoutes.get("/main-todo/:id", verifyUser, getSingleMainTodo);

// UPDATE
mainTodoRoutes.put("/main-todo/:id", verifyUser, updateMainTodo);

// DELETE
mainTodoRoutes.delete("/main-todo/:id", verifyUser, deleteMainTodo);
