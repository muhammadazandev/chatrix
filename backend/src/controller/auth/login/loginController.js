import User from "../../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Incomplete credentials",
        success: false,
      });
    }

    const isExist = await User.findOne({ email });

    if (!isExist) {
      return res.status(404).json({
        message: "User not found, try changing the email",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, isExist.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Password is incorrect",
        success: false,
      });
    }

    // Generate and save JWT access token in cookies

    const accessToken = jwt.sign(
      {
        username: isExist.username,
        email: isExist.email,
        profilePicture: isExist.profilePicture,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Generate and save JWT refresh token in cookies

    const refreshToken = jwt.sign(
      {
        username: isExist.username,
        email: isExist.email,
        profilePicture: isExist.profilePicture,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "User logged in successful",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}
