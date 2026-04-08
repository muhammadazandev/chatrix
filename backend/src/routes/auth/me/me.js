import express from "express";
import protect from "../../../middleware/protect.js";
import meController from "../../../controller/auth/me/meController.js";

const meRouter = express.Router();

meRouter.get("/", protect, meController);

export default meRouter;
