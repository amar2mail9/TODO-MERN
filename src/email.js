import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const otpSender = async (otp, userEmail, name) => {
  const info = await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Your One-Time Password (OTP) for Verification",
    html: `
    <div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn8ETQ-Y8VvjmAJy_E8lFYkYzQID8hVJU4vQ&s" alt="Polytechub" width="100" style="margin-bottom: 10px;" />
          <h1 style="font-size: 24px; color: #007bff; margin: 0;">Polytechub</h1>
          <p style="color: #999; font-size: 14px;">Smart solutions, built by you.</p>
        </div>

        <h2 style="text-align: center; color: #333;">OTP Verification</h2>

        <p style="font-size: 16px; color: #444;">Hello <strong>${name}</strong>,</p>

        <p style="font-size: 16px; color: #444;">
          You requested a one-time password (OTP) to verify your email. Use the following code:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #007bff; color: #fff; font-size: 28px; padding: 16px 32px; border-radius: 8px; display: inline-block; letter-spacing: 6px; font-weight: bold;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #666; text-align: center;">
          This OTP will expire in 10 minutes.<br />
          Please do not share this code with anyone.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

        <p style="font-size: 12px; color: #aaa; text-align: center;">
          If you did not request this, please ignore this email.<br />
          &copy; ${new Date().getFullYear()} Polytechub. All rights reserved.
        </p>
      </div>
    </div>
    `,
  });

  console.log("Message sent:", info.messageId);
};

export const welcomeSender = async (userEmail, name) => {
  const info = await transporter.sendMail({
    from: `"Polytechub Team" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Welcome to Polytechub 🎉",
    html: `
    <div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);">
        
        <div style="text-align: center;">
          <img src="https://polytechub.vercel.app/logo192.png" alt="Polytechub Logo" width="70" style="margin-bottom: 10px;" />
          <h1 style="color: #007bff; font-size: 28px; margin: 0;">Welcome to Polytechub</h1>
          <p style="color: #666; font-size: 14px;">Where innovation meets code</p>
        </div>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 16px; color: #333;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="font-size: 16px; color: #555;">
          We're thrilled to have you on board! 🎉<br />
          You've successfully joined <strong>Polytechub</strong> — your new digital home for web development tools and resources.
        </p>

        <p style="font-size: 15px; color: #555;">
          Here's what you can do next:
        </p>
        <ul style="font-size: 14px; color: #444; line-height: 1.6;">
          <li>💡 Explore powerful tools like our Rich Text Editor</li>
          <li>📚 Access full-stack project guides (MERN, etc.)</li>
          <li>🎓 Learn JavaScript, React, Node.js, and more</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://polytechub.vercel.app" target="_blank"
             style="background-color: #007bff; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px;">
            Go to Dashboard
          </a>
        </div>

        <p style="font-size: 14px; color: #888; text-align: center;">
          If you have any questions, feel free to reply to this email.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 12px; color: #aaa; text-align: center;">
          &copy; ${new Date().getFullYear()} Polytechub. All rights reserved.
        </p>
      </div>
    </div>
    `,
  });

  console.log("Welcome message sent:", info.messageId);
};

export const loginSuccessSender = async (userEmail, name) => {
  const info = await transporter.sendMail({
    from: `"Polytechub Team" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Login Successful - Polytechub",
    html: `
      <div style="background-color:#f8f9fa;padding:30px 0;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:auto;background-color:#ffffff;padding:25px;border-radius:6px;box-shadow:0 0 10px rgba(0,0,0,0.08);">
          <h2 style="color:#28a745;text-align:center;">Login Successful</h2>
          <p style="font-size:15px;color:#333;">Hi <strong>${name}</strong>,</p>
          <p style="font-size:15px;color:#333;">
            You have successfully logged in to your <strong>Polytechub</strong> account.
          </p>
          <p style="font-size:14px;color:#666;">
            If this wasn't you, we recommend changing your password immediately to secure your account.
          </p>
          <div style="text-align:center;margin:30px 0;">
            <a href="https://polytechub.vercel.app/logo.png" style="background-color:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:14px;">
              Go to Dashboard
            </a>
          </div>
          <p style="font-size:12px;color:#999;text-align:center;">
            &copy; ${new Date().getFullYear()} Polytechub. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });

  console.log("Login success email sent:", info.messageId);
};
