import express from "express";
import searchRouter from "./search/search.js";

const router = express.Router();

router.use("/search", searchRouter);

export default router;
