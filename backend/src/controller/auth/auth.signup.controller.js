import User from "../../models/user.model.js";
import { sendOtpMail } from "../../utils/mailer.js";
import bcrypt from "bcryptjs";
import OTP from "../../models/Otp.model.js";

async function verifyOtpController(req, res) {
  try {
    const { username, password, email, otpCode } = req.body;

    if (!username || !password || !email || !otpCode) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const findMatchedOtp = await OTP.findOne({ email });

    if (!findMatchedOtp) {
      return res.status(404).json({
        message: "OTP not found or expired",
        success: false,
      });
    }

    const compareOtp = await bcrypt.compare(
      String(otpCode), // plain OTP string (user input)
      findMatchedOtp.otp, // hashed OTP from DB (string)
    );

    if (!compareOtp) {
      return res.status(400).json({
        message: "OTP is incorrect",
        success: false,
      });
    }

    const now = new Date();

    if (now > findMatchedOtp.expiresAt) {
      return res.status(401).json({
        message: "OTP expired",
        success: false,
      });
    }

    // Check if user already exists (in case of duplicate signup attempts)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Clean up the OTP after successful verification
    await OTP.deleteOne({ email });

    return res.status(200).json({
      message: "Signup successful",
      success: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

async function signupController(req, res) {
  try {
    const { username, email, password } = req.body ?? {};

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Incomplete credentials",
        success: false,
      });
    }

    const isExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (isExist) {
      return res.status(409).json({
        message: "Username or email is already taken",
        success: false,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be 8 characters long",
        success: false,
      });
    }

    // Delete old OTPs if exist in document
    await OTP.deleteMany({ email });

    // Send OTP
    const otpCode = String(Math.floor(1000 + Math.random() * 9000));

    const expiresAt = new Date(Date.now() + 90 * 1000);

    const hashedOtp = await bcrypt.hash(otpCode, 10);

    await OTP.create({ email, otp: hashedOtp, expiresAt });

    await sendOtpMail(email, otpCode);

    return res.status(201).json({
      message: "OTP sent to your email",
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Server error", success: false });
  }
}

export { verifyOtpController, signupController };
