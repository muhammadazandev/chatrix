import express from "express";
import refreshController from "../../../controller/auth/refresh/refreshController.js";

const refreshRouter = express.Router();

refreshRouter.post("/", refreshController);

export default refreshRouter;
