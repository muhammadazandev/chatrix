import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "../models/user.model.js";

export const socketAuth = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) return next(new Error("No cookies present"));

    const parsed = cookie.parse(cookies);

    const token = parsed.accessToken;

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const userDoc = await User.findById(decoded?.userId).select(
      "profilePicture",
    );
    
    const profilePicture = userDoc?.profilePicture;

    const fullUserInfo = { ...decoded, profilePicture: profilePicture };

    socket.user = fullUserInfo;

    next();
  } catch (err) {
    next(new Error("Unauthorized socket connection"));
  }
};
