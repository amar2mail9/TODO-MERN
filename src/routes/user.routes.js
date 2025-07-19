import express from "express";
import {
  loginWithOTP,
  registration,
  resendOpt,
  userLoginWithPasswords,
  verifyLoginOTP,
  verifyOtp,
} from "../controllers/user.controller.js";

export const userRoutes = express.Router();

userRoutes.post("/user/signup", registration);
userRoutes.post("/user/signup/verify", verifyOtp);
userRoutes.post("/user/signup/resend-otp", resendOpt);
userRoutes.post("/user/pass/login", userLoginWithPasswords);
userRoutes.post("/user/otp/login", loginWithOTP);
userRoutes.post("/user/otp/login/verify", verifyLoginOTP);
