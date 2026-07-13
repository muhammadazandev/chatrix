import express from "express";
import { getOldMessages } from "../controller/message/old.message.controller.js";
import uploadMessage from "../middleware/upload.message.js";
import { mediaMessage } from "../controller/message/media.message.controller.js";

const router = express.Router();

router.get("/:conversationId", getOldMessages);
router.post(
  "/media",
  uploadMessage.single("file"),
  mediaMessage,
);

export default router;
