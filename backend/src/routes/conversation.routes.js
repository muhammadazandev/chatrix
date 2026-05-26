import express from "express";
import {
  accessConversationController,
  getConversations,
  verifyConversation,
} from "../controller/conversation/conversation.controller.js";

const router = express.Router();

router.post("/access", accessConversationController);
router.get("/", getConversations);
router.get("/:conversationId", verifyConversation);

export default router;
