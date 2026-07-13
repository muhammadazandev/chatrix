import express from "express";
import {
  createGroup,
  getParticipants,
} from "../controller/group/group.controller.js";
import uploadProfilePicture from "../middleware/upload.profile.picture.js";
import { updateProfilePicture } from "../controller/group/update.profile.picture.controller.js";
import Conversation from "../models/conversation.model.js";

const router = express.Router();

async function checkGroupAdmin(req, res, next) {
  const { groupId } = req.params;
  const userId = req.user.id;

  const group = await Conversation.findOne({
    _id: groupId,
    participants: userId,
  });

  if (!group) {
    return res.status(404).json({
      success: false,
      message: "Group not found",
    });
  }

  const role = group.participantRoles.get(userId);

  if (role === "member") {
    return res.status(403).json({
      success: false,
      message: "Members cannot update the group.",
    });
  }

  req.group = group; // reuse in controller

  next();
}

router.post("/create-group", uploadProfilePicture.single("profilePicture"), createGroup);
router.get("/participants/:groupId", getParticipants);
router.patch(
  "/update-profile-picture/:groupId",
  checkGroupAdmin,
  uploadProfilePicture.single("profilePicture"),
  updateProfilePicture,
);

export default router;
