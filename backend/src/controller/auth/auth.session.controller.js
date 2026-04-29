import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function generateToken(
  res,
  tokenName,
  userId,
  username,
  email,
  profilePicture,
  secret,
  expiresIn,
  maxAge,
) {
  const token = jwt.sign(
    {
      userId: userId,
      username: username,
      email: email,
      profilePicture: profilePicture,
    },
    secret,
    {
      expiresIn: expiresIn,
    },
  );

  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: maxAge,
  });
}

async function logoutController(req, res) {
  try {
    // Clear both access and refresh tokens
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

    return res
      .status(200)
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}

async function loginController(req, res) {
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
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, isExist.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Generate JWT access token

    generateToken(
      res,
      "accessToken",
      isExist._id,
      isExist.username,
      isExist.email,
      isExist.profilePicture,
      process.env.JWT_ACCESS_SECRET,
      "1h",
      60 * 60 * 1000, // 1 hour
    );

    // Generate JWT refresh token

    generateToken(
      res,
      "refreshToken",
      isExist._id,
      isExist.username,
      isExist.email,
      isExist.profilePicture,
      process.env.JWT_REFRESH_SECRET,
      "7d",
      7 * 24 * 60 * 60 * 1000, // 7 Days
    );

    return res.status(200).json({
      message: "User logged in successful",
      success: true,
      user: {
        id: isExist._id,
        username: isExist.username,
        email: isExist.email,
        profilePicture: isExist.profilePicture,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}

async function refreshController(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "No refresh token", success: false });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        // expire / invalid -> clear cookies (auto-logout)
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
        return res.status(401).json({
          message: "Invalid or expired refresh token",
          success: false,
        });
      }

      generateToken(
        res,
        "accessToken",
        decoded.userId,
        decoded.username,
        decoded.email,
        decoded.profilePicture,
        process.env.JWT_ACCESS_SECRET,
        "1h",
        60 * 60 * 1000,
      );

      return res
        .status(200)
        .json({ message: "Access token refreshed", success: true });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}

async function meController(req, res) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        isLoggedIn: false,
        message: "User not logged in",
        success: false,
      });
    }

    return res.status(200).json({
      isLoggedIn: true,
      message: "Logged in",
      user: req.user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isLoggedIn: false,
      message: "Internal server error",
      success: false,
    });
  }
}

export { meController, logoutController, loginController, refreshController };
