import express from "express";
import { getUnreadMessages } from "../controllers/messageController.js";

const router = express.Router();
router.get("/unread", getUnreadMessages);

export default router;
