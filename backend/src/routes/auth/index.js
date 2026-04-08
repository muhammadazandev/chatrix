import express from "express";
import signupRouter from "./signup/signup.js";
import verifyOtpRouter from "./verifyOtp/verifyOtp.js";
import loginRouter from "./login/login.js";
import meRouter from "./me/me.js";
import refreshRouter from "./refresh/refresh.js";
import logoutRouter from "./logout/logout.js";
import deleteAccountRouter from "./deleteAccount/deleteAccount.js";
import forgotPasswordRouter from "./forgorPassword/forgorPassword.js";
import resetPasswordRouter from "./resetPassword/resetPassword.js";

const router = express.Router();

router.use("/signup", signupRouter);
router.use("/verify-otp", verifyOtpRouter);
router.use("/login", loginRouter);
router.use("/me", meRouter);
router.use("/refresh", refreshRouter);
router.use("/logout", logoutRouter);
router.use("/delete-account", deleteAccountRouter);
router.use("/forgot-password", forgotPasswordRouter);
router.use("/reset-password/:token", resetPasswordRouter);

export default router;
