import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async () => {
  try {
    mongoose.connect(`${process.env.DBURI}`).then(() => {
      console.log("Data Base connected Successfully");
    });
  } catch (error) {
    console.log(error);
  }
};
