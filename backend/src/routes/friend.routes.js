import express from "express";
import protect from "../middleware/protect.js";

import sendFriendRequest from "../controller/friend/friend.request.send.controller.js";
import acceptFriendRequest from "../controller/friend/friend.request.accept.controller.js";
import {
  rejectFriendRequest,
  cancelFriendRequest,
  unfriend,
} from "../controller/friend/friend.request.decision.controller.js";
import {
  checkRelationship,
  getAllFriends,
  getAllPendingRequests,
} from "../controller/friend/friend.info.controller.js";
import { block, unblock } from "../controller/friend/friend.blocking.controller.js";

const router = express.Router();

router.post("/request/:receiverId", protect, sendFriendRequest);
router.put("/accept/:requestId", protect, acceptFriendRequest);
router.delete("/reject/:requestId", protect, rejectFriendRequest);
router.delete("/cancel/:requestId", protect, cancelFriendRequest);
router.delete("/unfriend/:userId", protect, unfriend);
router.get("/list/all", protect, getAllFriends);
router.get("/list/pending", protect, getAllPendingRequests);
router.get("/status/:userId", protect, checkRelationship);
router.post("/block/:userId", protect, block);
router.post("/unblock/:userId", protect, unblock);

export default router;
