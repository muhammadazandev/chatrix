import express from "express";
import logoutController from "../../../controller/auth/logout/logoutController.js";

const logoutRouter = express.Router();

logoutRouter.post("/", logoutController);

export default logoutRouter;
