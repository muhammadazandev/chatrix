import express from "express";
import loginController from "../../../controller/auth/login/loginController.js";

const loginRouter = express.Router();

loginRouter.post("/", loginController);

export default loginRouter;
