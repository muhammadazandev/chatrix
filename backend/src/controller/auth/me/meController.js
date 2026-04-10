export default async function meController(req, res) {
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
      message: "Internal server error",
      success: false,
    });
  }
}
