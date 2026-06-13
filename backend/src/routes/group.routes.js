import express from "express";
import { createGroup } from "../controller/group/group.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create-group", upload.single("profilePicture"), createGroup);

export default router;
