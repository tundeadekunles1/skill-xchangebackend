// import User from "../models/Users.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import dotenv from "dotenv";
// import nodemailer from "nodemailer";

// dotenv.config();

// import sendEmail from "../utils/sendEmail.js";

// // Registration function

// export const register = async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "Email already in use" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user with isVerified: false
//     const user = await User.create({
//       fullName,
//       email,
//       password: hashedPassword,
//       isVerified: false,
//     });

//     // Generate email verification token
//     const emailToken = jwt.sign(
//       { userId: user._id, fullName: user.fullName },
//       process.env.EMAIL_TOKEN_SECRET,
//       { expiresIn: "2h" }
//     );

//     // Create verification link
//     const verificationLink = `http://15.223.230.143/verify/${emailToken}`;

//     // Send email using NodeMailer
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: '"Skill Bridge" <no-reply@skillbridge.com>',
//       to: email,
//       subject: "Verify Your Email",
//       html: `
//         <h2>Welcome, ${fullName}!</h2>
//         <p>Thank you for signing up on SkillBridge. Please verify your email by clicking the link below:</p>
//         <a href="${verificationLink}">Verify Email</a>
//         <p>This link will expire in 15 minutes.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(201).json({
//       message: "User created successfully. Please verify your email.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // login function
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       {
//         userId: user._id,
//         fullName: user.fullName,
//         hasCompletedProfile: user.hasCompletedProfile,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );

//     res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // forgot password function

// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const token = crypto.randomBytes(32).toString("hex");
//     user.resetToken = token;
//     user.resetTokenExpire = Date.now() + 3600000; // 1 hour
//     await user.save();

//     const resetLink = `http://15.223.230.143/reset-password/${token}`;

//     console.log("Sending reset email to:", user.email);

//     // Send email using NodeMailer
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: '"Skill Bridge" <no-reply@skillbridge.com>',
//       to: email,
//       subject: "click to reset your password",
//       html: `
//         <a href="${resetLink}">Reset Your Password</a>
//         <p>This link will expire in 15 minutes.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     // await sendEmail({
//     //   to: user.email,
//     //   subject: "Reset Your Password",
//     //   html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
//     // });

//     res.json({ message: "Reset link sent" });
//   } catch (error) {
//     console.error("Error in forgotPassword:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// // reset password function
// export const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   const user = await User.findOne({
//     resetToken: token,
//     resetTokenExpire: { $gt: Date.now() },
//   });

//   if (!user)
//     return res.status(400).json({ message: "Invalid or expired token" });

//   const hashedPassword = await bcrypt.hash(password, 12);
//   user.password = hashedPassword;
//   user.resetToken = undefined;
//   user.resetTokenExpire = undefined;
//   await user.save();

//   res.json({ message: "Password updated" });
// };

// // function to send verifaction Email
// export const sendVerificationEmail = async (user) => {
//   const token = crypto.randomBytes(32).toString("hex");
//   user.resetToken = token;
//   user.resetTokenExpire = Date.now() + 3600000;
//   await user.save();

//   const verifyLink = `http://15.223.230.143/verify/${token}`;
//   await sendEmail({
//     to: user.email,
//     subject: "Verify Your Email",
//     html: `<p>Click <a href="${verifyLink}">here</a> to verify your email</p>`,
//   });
// };

// // function to verify Email
// export const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;

//     const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);

//     const user = await User.findById(decoded.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.isVerified = true;
//     await user.save();

//     // Create JWT token for login
//     const loginToken = jwt.sign(
//       { id: user._id, fullName: user.fullName },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.status(200).json({
//       message: "Email verified successfully",
//       token: loginToken,
//       user: { name: user.name, email: user.email }, // optional
//     });
//   } catch (err) {
//     return res.status(400).json({ message: "Invalid or expired token" });
//   }
// };


Skip to content
 
Search Gists
Search...
All gists
Back to GitHub
@boiyelove
boiyelove/AuthController.js
Last active 1 hour ago • Report abuse
Code
Revisions
2
Clone this repository at &lt;script src=&quot;https://gist.github.com/boiyelove/c60905fa00db5ef80d923d056555c12e.js&quot;&gt;&lt;/script&gt;
<script src="https://gist.github.com/boiyelove/c60905fa00db5ef80d923d056555c12e.js"></script>
3MTTMentorship - Team 5 - Improved AuthController to use uuid.
AuthController.js
import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Still used for password reset
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid'; // Import UUID

dotenv.config();

// sendEmail utility is assumed to be correctly defined in "../utils/sendEmail.js"
import sendEmail from "../utils/sendEmail.js";

// --- Helper: Nodemailer Transporter ---
// It's good practice to define the transporter once if the config doesn't change.
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Registration function ---
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token (UUID)
    const emailToken = uuidv4();
    const emailTokenExpires = Date.now() + 12 * 60 * 60 * 1000; // Updated to 12 hours, close to 24 hours general practice

    // Create user with isVerified: false and email verification token
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      isVerified: false,
      emailVerificationToken: emailToken,
      emailVerificationTokenExpire: emailTokenExpires,
    });

    // Create verification link
    const verificationLink = `http://15.223.230.143/verify/${emailToken}`; // Updated to use the UUID token

    // Send email using NodeMailer
    const mailOptions = {
      from: '"Skill Bridge" <no-reply@skillbridge.com>',
      to: email,
      subject: "Verify Your Email for Skill Bridge",
      html: `
        <h2>Welcome, ${fullName}!</h2>
        <p>Thank you for signing up on SkillBridge.</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 2 hours.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User created successfully. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// --- Login function ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      // Optional: Resend verification email or prompt user to verify
      // await sendVerificationEmail(user); // You could uncomment this if you want to resend on login attempt
      return res.status(401).json({ message: "Email not verified. Please check your inbox or request a new verification email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        fullName: user.fullName,
        hasCompletedProfile: user.hasCompletedProfile,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// --- Forgot password function ---
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with that email not found." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://15.223.230.143/reset-password/${token}`;  // Updated to use the UUID token

    const mailOptions = {
      from: '"Skill Bridge" <no-reply@skillbridge.com>',
      to: user.email,
      subject: "Password Reset Request for Skill Bridge",
      html: `
        <p>You requested a password reset for your Skill Bridge account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset link has been sent to your email." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error while sending reset link." });
  }
};

// --- Reset password function ---
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset token." });
    }

    if (!password || password.length < 6) { // Basic password validation
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Password has been updated successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Server error while resetting password." });
  }
};

// --- Function to resend verification Email ---
// This function is now updated to use UUID and the correct fields for email verification.
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate new email verification token (UUID)
    const emailToken = uuidv4();
    user.emailVerificationToken = emailToken;
    user.emailVerificationTokenExpire = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
    await user.save();

    const verificationLink = `http://15.223.230.143/verify/${emailToken}`; // Updated to use the UUID token

    // Using the generic sendEmail utility from "../utils/sendEmail.js"
    // Ensure your sendEmail utility is configured to use the transporter or has its own.
    // For this example, I'm directly using the transporter defined above for clarity.
    const mailOptions = {
        from: '"Skill Bridge" <no-reply@skillbridge.com>',
        to: user.email,
        subject: "Resend: Verify Your Email for Skill Bridge",
        html: `
            <p>We received a request to resend the verification email for your Skill Bridge account.</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
            <p>This link will expire in 2 hours.</p>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email resent. Please check your inbox." });

  } catch (error) {
    console.error("Error in resendVerificationEmail:", error);
    res.status(500).json({ message: "Server error while resending verification email." });
  }
};


// --- Function to verify Email ---
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params; // This token is now the UUID

    // Find user by the email verification token and check if it's not expired
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token. Please request a new one." });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined; // Clear the token
    user.emailVerificationTokenExpire = undefined; // Clear the expiration
    await user.save();

    // Optional: Automatically log the user in by creating a JWT token
    const loginToken = jwt.sign(
      { userId: user._id, fullName: user.fullName, hasCompletedProfile: user.hasCompletedProfile },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // Or your preferred duration
      }
    );

    res.status(200).json({
      message: "Email verified successfully. You can now log in.",
      token: loginToken, // You can send this to auto-login the user on the frontend
      user: { fullName: user.fullName, email: user.email, isVerified: user.isVerified },
    });

  } catch (err) {
    console.error("Email Verification Error:", err);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        // This specific error handling for JWT is no longer relevant here,
        // but general error handling is good.
        return res.status(400).json({ message: "Invalid or expired token." });
    }
    res.status(500).json({ message: "Server error during email verification." });
  }
};

