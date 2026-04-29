import express from "express";
import protect from "../middleware/protect.js";
import { searchController } from "../controller/user/user.controller.js";

const router = express.Router();

router.get("/search", protect, searchController);

export default router;
