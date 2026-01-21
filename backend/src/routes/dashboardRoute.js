import express from "express";
import { getStats, getUpcomingPosts } from "../controllers/dashboardController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const router = express.Router();

router.use(userMiddleware);

router.get("/stats", getStats);
router.get("/upcoming", getUpcomingPosts);

export default router;
