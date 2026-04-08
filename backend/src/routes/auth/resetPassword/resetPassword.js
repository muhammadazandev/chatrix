import express from "express";
import resetPasswordController from "../../../controller/auth/resetPassword/resetPasswordController.js";

const resetPasswordRouter = express.Router({ mergeParams: true }); // mergeParams is for accessing parent route's parameters

resetPasswordRouter.post("/", resetPasswordController);

export default resetPasswordRouter;
