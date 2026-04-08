import bcrypt from "bcryptjs";
import OTP from "../../../models/Otp.js";
import User from "../../../models/User.js";

export default async function verifyOtpController(req, res) {
  try {
    const { username, password, email, otpCode } = req.body;

    if (!username || !password || !email || !otpCode) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const findMatchedOtp = await OTP.findOne({ email });

    if (!findMatchedOtp) {
      return res.status(404).json({
        message: "OTP not found or expired",
      });
    }

    const compareOtp = await bcrypt.compare(
      String(otpCode), // plain OTP string (user input)
      findMatchedOtp.otp, // hashed OTP from DB (string)
    );

    if (!compareOtp) {
      return res.status(400).json({
        message: "OTP is incorrect",
      });
    }

    const now = new Date();

    if (now > findMatchedOtp.expiresAt) {
      return res.status(401).json({
        message: "OTP expired",
      });
    }

    // Check if user already exists (in case of duplicate signup attempts)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Clean up the OTP after successful verification
    await OTP.deleteOne({ email });

    return res.status(200).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
