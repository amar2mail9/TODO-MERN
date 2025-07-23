import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/user.model.js";
dotenv.config();
export const verifyUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return res.status(400).send({
        success: false,
        error: "Login again",
      });
    }
    if (accessToken) {
      const verifyJWt = jwt.verify(accessToken, process.env.PRIVATEKEY);
      if (!verifyJWt) {
        return res.status(400).send({
          success: false,
          error: "Token Expire",
        });
      }

      req.user = await userModel.findById(verifyJWt._id);
      next();
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};
