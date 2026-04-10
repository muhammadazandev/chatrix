import PasswordReset from "../../../models/PasswordReset.js";
import User from "../../../models/User.js";
import { sendPasswordResetMail } from "../../../utils/mailer.js";
import crypto from "crypto";

export default async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const isExist = await User.findOne({ email });

    if (isExist) {
      // Delete old documents if exist in document
      await PasswordReset.deleteMany({ email });

      // create a random token for verifying the user and sent it to user via email
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await PasswordReset.create({
        email,
        token: hashedToken,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

      try {
        await sendPasswordResetMail(email, resetLink);
      } catch (emailError) {
        // Clean up the reset token if email sending fails
        await PasswordReset.deleteOne({ email, token: hashedToken });
        return res
          .status(500)
          .json({ message: "Failed to send reset link email", success: false });
      }
    }

    // No else block - silent fail for non-users

    return res.status(200).json({
      message: "Check your email if account exists.",
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
