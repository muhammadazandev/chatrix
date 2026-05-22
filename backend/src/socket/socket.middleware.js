import jwt from "jsonwebtoken";
import cookie from "cookie";

export const socketAuth = (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) return next(new Error("No cookies present"));

    const parsed = cookie.parse(cookies);

    const token = parsed.accessToken;

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    socket.user = decoded;

    next();
  } catch (err) {
    next(new Error("Unauthorized socket connection"));
  }
};
