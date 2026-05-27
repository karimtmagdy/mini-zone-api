const { fn } = require("../lib/utils");
const { Chat } = require("../models/ChatBot");
const { AppError } = require("../middleware/errorHandler");
const { getDeepSeekResponse } = require("./deepseek.service");

exports.saveChatInteraction = async ({
  prompt,
  response,
  tokens = 0,

  role = "user",
}) => {
  try {
    return await Chat.create({
      prompt,
      response,
      tokens,

      model,
      role,
      sender,
      finish_reason,
      error,
    });
  } catch (err) {
    console.error("❌ Error saving chat interaction:", err.message);
    throw err;
  }
};
exports.createChat = fn(async (req, res, next) => {
  const { role, prompt } = req.body;
  try {
    const botResponse = await getDeepSeekResponse(req);
    const payload = {
      role,
      prompt,
      response: botResponse,
      tokens: data.usage?.total_tokens || 0,
    };
    const chat = await Chat.create(payload);
    res.status(201).json({ chat });
  } catch (error) {
    return next(new AppError("Failed to get bot response", 500));
  }
});
 
