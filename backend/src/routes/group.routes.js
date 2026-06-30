import express from "express";
import { createGroup, getParticipants } from "../controller/group/group.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create-group", upload.single("profilePicture"), createGroup);
router.get("/participants/:groupId", getParticipants);

export default router;
