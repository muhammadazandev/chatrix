import express from "express";
import protect from "../../../middleware/protect.js";
import searchController from "../../../controller/users/search/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/", protect, searchController);

export default searchRouter;
