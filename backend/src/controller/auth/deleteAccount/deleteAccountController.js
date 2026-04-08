import User from "../../../models/User.js";

export default async function deleteAccountController(req, res) {
  try {
    const { email } = req.user;

    const deleteUser = await User.deleteOne({ email });

    if (deleteUser.deletedCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
