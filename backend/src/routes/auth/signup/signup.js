import express from "express";
import signupController from "../../../controller/auth/signup/signupController.js";

const signupRouter = express.Router();

signupRouter.post("/", signupController);

export default signupRouter;
