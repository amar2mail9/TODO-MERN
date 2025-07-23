import express from "express";
import { verifyUser } from "../middlewares/middleware.js";
import {
  createSubTodo,
  deleteSubTodo,
  editSubTodo,
  getAllTodos,
} from "../controllers/subTodo.controller.js";

export const subTodoRoutes = express.Router();
subTodoRoutes.post("/create/sub-todo", verifyUser, createSubTodo);
subTodoRoutes.get("/subtodos/:slug", verifyUser, getAllTodos);
subTodoRoutes.put("/subtodos/:id", verifyUser, editSubTodo);
subTodoRoutes.delete("/subtodos/:id", verifyUser, deleteSubTodo);
