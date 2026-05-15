import express from "express";
import protect from "../middleware/protect.js";
import { searchController } from "../controller/user/user.search.controller.js";
import {
  updateBioController,
  updateProfilePictureController,
  updateUsernameController,
} from "../controller/user/user.update.profile.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/search", protect, searchController);
router.patch("/update-username", protect, updateUsernameController);
router.patch("/update-bio", protect, updateBioController);
router.patch(
  "/update-profile-picture",
  protect,
  upload.single("profilePicture"),
  updateProfilePictureController,
);

export default router;
