import express from "express";
import forgotPasswordController from "../../../controller/auth/forgotPassword/forgotPasswordController.js";

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post("/", forgotPasswordController);

export default forgotPasswordRouter;
