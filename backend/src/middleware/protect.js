import jwt from "jsonwebtoken";

export default async function protect(req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = {
      username: decoded.username,
      email: decoded.email,
      profilePicture: decoded.profilePicture,
    };

    next(); // Connected to protected route
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "Invalid token",
    });
  }
}
