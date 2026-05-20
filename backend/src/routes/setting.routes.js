import express from "express";
import {
  getSettingController,
  updateSettingController,
} from "../controller/setting/setting.appearance.controller.js";

const router = express.Router();

router.patch("/update", updateSettingController);
router.get("/get", getSettingController);

export default router;
