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

router.get("/search", searchController);
router.patch("/update-username", updateUsernameController);
router.patch("/update-bio", updateBioController);
router.patch(
  "/update-profile-picture",
  upload.single("profilePicture"),
  updateProfilePictureController,
);

export default router;
