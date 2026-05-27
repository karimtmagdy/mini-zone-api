import { Router } from "express";
// import { GoogleService } from "../services/chat/google.service";
// import {
//   createChat,
//   deleteChat,
//   getChats,
//   singleChat,
//   updateChat,
// } from "../services/chat.service";
// import { authorize } from "../middleware/is-verify";
const router = Router();

// router.post("/gemini", GoogleService);
// router.route("/").post(createChat).get(getChats);
// router.post("/openai", OpenAIService);
// router.post("/deepseek", OpenAIService);
// router.route("/:id").get(singleChat).delete(deleteChat).patch(updateChat);
// "/api/chat/:chatId/messages"
export { router as chatRouter };
