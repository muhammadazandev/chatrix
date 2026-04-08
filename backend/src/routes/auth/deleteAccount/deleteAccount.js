import deleteAccountController from "../../../controller/auth/deleteAccount/deleteAccountController.js";
import express from "express";
import protect from "../../../middleware/protect.js";

const deleteAccountRouter = express.Router();

deleteAccountRouter.delete("/", protect, deleteAccountController);

export default deleteAccountRouter;
