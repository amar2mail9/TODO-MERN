import express from "express";
import { connectDB } from "./db/db.js";
connectDB();
import dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes.js";
dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/v1", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server isn running on PORT: ", process.env.PORT);
  console.log("http://localhost:" + process.env.PORT);
});
