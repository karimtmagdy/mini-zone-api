import { Router } from "express";
import { AiController } from "../controllers/ai.controller.js";

const router = Router();

router.post("/chat", AiController.chat);
router.get("/history/:userId", AiController.getHistory);
router.get("/conversations/:userId", AiController.getConversations);
router.get("/messages/:conversationId", AiController.getConversationMessages);
router.delete("/messages/:messageId", AiController.deleteMessage);
router.delete("/conversations/:conversationId", AiController.deleteConversation);

export default {
  path: "/ai",
  router,
};
