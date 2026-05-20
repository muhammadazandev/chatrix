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

router.post("/request/:receiverId", sendFriendRequest);
router.put("/accept/:requestId", acceptFriendRequest);
router.delete("/reject/:requestId", rejectFriendRequest);
router.delete("/cancel/:requestId", cancelFriendRequest);
router.delete("/unfriend/:userId", unfriend);
router.get("/list/all", getAllFriends);
router.get("/list/pending", getAllPendingRequests);
router.get("/list/blocked", getAllBlockedUsers);
router.get("/status/:userId", checkRelationship);
router.post("/block/:userId", block);
router.delete("/unblock/:userId", unblock);

export default router;
