import jwt from "jsonwebtoken";

export default async function refreshController(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        // expire / invalid -> clear cookies (auto-logout)
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
        return res
          .status(401)
          .json({ message: "Invalid or expired refresh token" });
      }

      const newAccessToken = jwt.sign(
        {
          username: decoded.username,
          email: decoded.email,
          profilePicture: decoded.profilePicture,
        },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "1h",
        },
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // Match JWT expiry (1 hour)
      });

      return res.status(200).json({ message: "Access token refreshed" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
