import User from "../../../models/User.js";
import OTP from "../../../models/Otp.js";
import { sendOtpMail } from "../../../utils/mailer.js";
import bcrypt from "bcryptjs";

export default async function signupController(req, res) {
  try {
    const { username, email, password } = req.body ?? {};

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Incomplete credentials",
      });
    }

    const isExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (isExist) {
      return res.status(409).json({
        message: "Username or email is already taken",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be 8 characters long",
      });
    }

    // Delete old OTPs if exist in document
    await OTP.deleteMany({ email });

    // Send OTP
    const otpCode = String(Math.floor(1000 + Math.random() * 9000));

    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

    const hashedOtp = await bcrypt.hash(otpCode, 10);

    await OTP.create({ email, otp: hashedOtp, expiresAt });

    await sendOtpMail(email, otpCode);

    return res.status(201).json({
      status: "OTP sent",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Server error" });
  }
}
