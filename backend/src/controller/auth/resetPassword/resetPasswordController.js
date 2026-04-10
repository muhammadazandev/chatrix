import bcrypt from "bcryptjs";
import PasswordReset from "../../../models/PasswordReset.js";
import User from "../../../models/User.js";
import crypto from "crypto";

export default async function resetPasswordController(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password)
      return res
        .status(400)
        .json({ message: "Token and password are required", success: false });

    if (password.length < 8)
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
        success: false,
      });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const isExist = await PasswordReset.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!isExist) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email: isExist.email },
      { $set: { password: hashedPassword } },
    );

    // Clean up the reset token after successful password reset
    await PasswordReset.deleteOne({ token: hashedToken });

    return res.status(200).json({
      message: "Password reset successful",
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
