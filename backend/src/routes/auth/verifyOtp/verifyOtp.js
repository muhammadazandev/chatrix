import express from "express";
import verifyOtpController from "../../../controller/auth/verifyOtp/verifyOtpController.js";

const verifyOtpRouter = express.Router();

verifyOtpRouter.post("/", verifyOtpController);

export default verifyOtpRouter;
