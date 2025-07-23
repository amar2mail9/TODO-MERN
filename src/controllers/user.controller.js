import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { loginSuccessSender, otpSender, welcomeSender } from "../email.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

// Generate 6-digit OTP
const otpGenerate = () => Math.floor(100000 + Math.random() * 900000);

// ✅ REGISTER
export const registration = async (req, res) => {
  try {
    const { username, fullname, email, password, role } = req.body;

    const existUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      return res.status(400).send({
        success: false,
        error: "User already exists",
        data: {
          email: existUser.email,
          username: existUser.username,
        },
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const generatedOtp = otpGenerate();

    const newUser = new userModel({
      username,
      fullname,
      email,
      password: hashedPassword,
      role,
      otp: generatedOtp,
    });

    await newUser.save();

    await otpSender(generatedOtp, email, fullname);

    // Clear OTP after 5 minutes (best practice)
    setTimeout(async () => {
      const user = await userModel.findOne({ email });
      if (user && !user.isVerified) {
        user.otp = null;
        await user.save();
      }
    }, 1000 * 60 * 5);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      email,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};

// ✅ VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        error: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).send({
        success: false,
        error: "User already verified",
      });
    }

    if (!user.otp) {
      return res.status(410).send({
        success: false,
        error: "OTP expired. Please request a new one.",
      });
    }

    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).send({
        success: false,
        error: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    await welcomeSender(user.email, user.fullname);

    return res.status(200).send({
      success: true,
      message: "Account verified successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};

// ✅ RESEND OTP
export const resendOpt = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        error: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).send({
        success: false,
        error: "User already verified",
      });
    }

    user.otp = otpGenerate();
    await user.save();

    await otpSender(user.otp, user.email, user.fullname);

    setTimeout(async () => {
      const u = await userModel.findOne({ email });
      if (u && !u.isVerified) {
        u.otp = null;
        await u.save();
      }
    }, 1000 * 60 * 5);

    return res.status(200).send({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};

// ✅ Login user

export const userLoginWithPasswords = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const existUser = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (existUser) {
      const matchPassword = await bcrypt.compareSync(
        password,
        existUser.password
      );

      // password not match
      if (!matchPassword) {
        return res.status(402).send({
          success: false,
          error: "invalid credential",
        });
      }

      if (matchPassword) {
        await jwt.sign(
          { _id: existUser._id },
          process.env.PRIVATEKEY,
          { expiresIn: "1d" },
          async (err, token) => {
            if (err) {
              return res.status(400).send({
                success: false,
                error: err,
              });
            }
            if (token) {
              await loginSuccessSender(
                existUser.email,
                existUser.fullname.toLocaleLowerCase()
              );
              return res.status(200).send({
                success: true,
                message: "Login Successfully",
                accessToken: token,
                user: {
                  userId: existUser._id,
                  fullname: existUser.fullname.toLocaleUpperCase(),
                  username: existUser.username,
                  email: existUser.email,
                },
              });
            }
          }
        );
      }
    } else {
      return res.status(404).send({
        success: false,
        error: "Create new account",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};

// login with otp
export const loginWithOTP = async (req, res) => {
  try {
    const { identifier } = req.body;
    const existUser = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (existUser) {
      console.log(existUser);
      existUser.otp = otpGenerate();
      await existUser.save();
      otpSender(existUser.otp, existUser.email, existUser.fullname);
      return res.status(200).send({
        success: true,
        message: "OTP sended",
      });
    }

    if (!existUser) {
      return res.status(404).send({
        success: false,
        error: "Create new Account",
      });
    }

    // if (existUser) {
    //   existUser.otp = otpGenerate();
    //   await existUser.save();
    //   await otpSender(existUser.otp, existUser.email, existUser.fullname);

    //   setTimeout(async () => {
    //     const u = await userModel.findOne({ email });
    //     if (u && !u.isVerified) {
    //       u.otp = null;
    //       await u.save();
    //     }
    //   }, 1000 * 60 * 5);

    //   if (existUser.otp !== otp) {
    //     return res.status(404).send({
    //       success: false,
    //       error: "Invalid OTP",
    //     });
    //   }
    //   if (existUser.otp === otp) {
    //     jwt.sign(
    //       { _id: existUser._id },
    //       process.env.PRIVATEKEY,
    //       {
    //         expiresIn: "1d",
    //       },
    //       (err, token) => {
    //         if (err) {
    //           return res.status(400).send({
    //             success: false,
    //             error: err,
    //           });
    //         }

    //         if (token) {
    //           return res.status(200).send({
    //             success: true,
    //             message: "Login Successfully",
    //             accessToken: token,
    //             user: {
    //               userId: existUser._id,
    //               fullname: existUser.fullname.toLocaleUpperCase(),
    //               username: existUser.username,
    //               email: existUser.email,
    //             },
    //           });
    //         }
    //       }
    //     );
    //   }
    // }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error,
    });
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        error: "Create new Account",
      });
    } else {
      if (!user.otp) {
        return res.status(410).send({
          success: false,
          error: "OTP expired. Please request a new one.",
        });
      }

      if (user.otp.toString() !== otp.toString()) {
        return res.status(400).send({
          success: false,
          error: "Invalid OTP",
        });
      }

      if (user.otp === otp) {
        await jwt.sign(
          { _id: user.id },
          process.env.PRIVATEKEY,
          {
            expiresIn: "1d",
          },
          async (err, token) => {
            if (err) {
              return res.status(400).send({
                success: false,
                error: err,
              });
            }
            if (token) {
              await loginSuccessSender(
                user.email,
                user.fullname.toLocaleLowerCase()
              );
              return res.status(200).send({
                success: true,
                message: "Login Successfully",
                accessToken: token,
                user: {
                  id: user._id,
                  email: user.email,
                  username: user.username,
                  isVerified: user.isVerified,
                },
              });
            }
          }
        );
      }
    }
  } catch (error) {
    return res.status(404).send({
      success: false,
      error: "Create new Account",
    });
  }
};
