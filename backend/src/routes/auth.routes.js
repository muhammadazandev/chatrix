import express from "express";
import protect from "../middleware/protect.js";
import rateLimit from "express-rate-limit";

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

// Login limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

// Signup limiter
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many signup attempts.",
  },
});

// Forgot password limiter
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset requests.",
  },
});

// Verify otp limiter
export const verifyOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP verification attempts.",
  },
});

// Reset password limiter
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset attempts.",
  },
});

// Refresh limiter
export const refreshPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset attempts.",
  },
});

router.post("/signup", signupLimiter, signupController);
router.post("/verify-otp", verifyOtpLimiter, verifyOtpController);
router.post("/login", loginLimiter, loginController);
router.get("/me", protect, meController);
router.post("/refresh", refreshController);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordController,
);
router.post(
  "/reset-password/:token",
  resetPasswordLimiter,
  resetPasswordController,
);
router.post("/logout", logoutController);
router.delete("/delete-account", protect, deleteAccountController);

export default router;
