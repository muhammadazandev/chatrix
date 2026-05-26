import express from "express"
import { getOldMessages } from "../controller/message/message.controller.js";

const router = express.Router();

router.get("/:conversationId", getOldMessages)

export default router;