import express from "express";
import { connectDB } from "./db/db.js";
import cors from "cors";

connectDB();

import dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes.js";
import { mainTodoRoutes } from "./routes/main.todo.routes.js";
import { subTodoRoutes } from "./routes/sub.todo.routes.js";
dotenv.config();
const app = express();

app.use(express.json());

app.use(cors());
app.use("/api/v1", userRoutes);
app.use("/api/v1", mainTodoRoutes);
app.use("/api/v1", subTodoRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server isn running on PORT: ", process.env.PORT);
  console.log("http://localhost:" + process.env.PORT);
});
