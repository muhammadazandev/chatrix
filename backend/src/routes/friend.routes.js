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
  getAllBlockedUsers,
  getAllFriends,
  getAllPendingRequests,
} from "../controller/friend/friend.info.controller.js";
import {
  block,
  unblock,
} from "../controller/friend/friend.blocking.controller.js";

const router = express.Router();

router.post("/request/:receiverId", protect, sendFriendRequest); // t
router.put("/accept/:requestId", protect, acceptFriendRequest); // t
router.delete("/reject/:requestId", protect, rejectFriendRequest); // t
router.delete("/cancel/:requestId", protect, cancelFriendRequest); // t
router.delete("/unfriend/:userId", protect, unfriend); // t
router.get("/list/all", protect, getAllFriends); // t
router.get("/list/pending", protect, getAllPendingRequests); // t
router.get("/list/blocked", protect, getAllBlockedUsers); // t
router.get("/status/:userId", protect, checkRelationship);
router.post("/block/:userId", protect, block);
router.delete("/unblock/:userId", protect, unblock);

export default router;
