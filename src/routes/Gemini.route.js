import { Router } from "express";
import {chatwithgemini} from "../controllers/Gemini.controller.js";
import { askChatbot } from "../controllers/chatbot.controller.js";
const router =Router();

router.post("/chatwithgemini",chatwithgemini);
router.post("/ask", askChatbot);
export default router;