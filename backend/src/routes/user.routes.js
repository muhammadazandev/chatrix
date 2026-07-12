import express from "express";
import protect from "../middleware/protect.js";
import { searchController } from "../controller/user/user.search.controller.js";
import {
  updateBioController,
  updateProfilePictureController,
  updateUsernameController,
} from "../controller/user/user.update.profile.controller.js";
import uploadProfilePicture from "../middleware/upload.profile.picture.js";
import { getUserProfile } from "../controller/user/user.profile.controller.js";

const router = express.Router();

router.get("/search", searchController);
router.patch("/update-username", updateUsernameController);
router.patch("/update-bio", updateBioController);
router.patch(
  "/update-profile-picture",
  uploadProfilePicture.single("profilePicture"),
  updateProfilePictureController,
);
router.get("/:userId/profile", protect, getUserProfile);

export default router;
