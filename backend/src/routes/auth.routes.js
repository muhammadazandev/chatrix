import express from "express";
import protect from "../middleware/protect.js";

// Controllers imports
import { deleteAccountController } from "../controller/auth/auth.account.controller.js";
import {
  forgotPasswordController,
  resetPasswordController,
} from "../controller/auth/auth.recovery.controller.js";
import {
  verifyOtpController,
  signupController,
} from "../controller/auth/auth.signup.controller.js";
import {
  meController,
  logoutController,
  loginController,
  refreshController,
} from "../controller/auth/auth.session.controller.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginController);
router.get("/me", protect, meController);
router.post("/refresh", refreshController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.post("/logout", logoutController);
router.delete("/delete-account", protect, deleteAccountController);

export default router;
