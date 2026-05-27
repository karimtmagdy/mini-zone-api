import { Request, Response } from "express";
import {   aiService } from "../services/ai.service.js";
import { ChatMessageModel } from "../models/chat.model.js";
import { ConversationModel } from "../models/conversation.model.js";

export class AiController {
  // constructor(private aiService: AiService) {}
  static async chat(req: Request, res: Response) {
    try {
      const { messages, userId, provider, model, conversationId } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required." });
      }

      // 1. Resolve or Create Conversation
      let activeConv: any;
      if (userId) {
        if (conversationId) {
          activeConv = await ConversationModel.findById(conversationId);
        }

        if (!activeConv) {
          activeConv = await ConversationModel.create({
            userId,
            title:
              messages[messages.length - 1]?.content?.substring(0, 30) ||
              "New Chat",
            provider: provider || "auto",
            model: model || "default",
          });
        }
      }

      // 2. Add system message if not present
      if (messages.length === 0 || messages[0].role !== "system") {
        messages.unshift({
          role: "system",
          content:
            "You are a helpful assistant for Mini Zone, an E-commerce platform. You can help users find products, categories, and brands. Always be polite and professional.",
        });
      }

      // 3. Save User Message
      let savedUserMsg: any = null;
      if (userId && messages.length > 0) {
        const lastUserMsg = messages[messages.length - 1];
        if (lastUserMsg.role === "user") {
          savedUserMsg = await ChatMessageModel.create({
            userId,
            conversationId: activeConv?._id,
            role: "user",
            content: lastUserMsg.content,
            provider,
            model,
            status: "delivered",
          });

          // Update conversation last message
          await ConversationModel.findByIdAndUpdate(activeConv._id, {
            lastMessage: lastUserMsg.content,
          });
        }
      }

      console.log(
        `AI Chat - Conv: ${activeConv?._id || "none"}, Provider: ${provider || "auto"}`,
      );

      const result = await aiService.chat(messages, userId, provider, model);
      const {
        message: aiMessage,
        usage,
        provider: usedProvider,
        model: usedModel,
      } = result;

      // 4. Save Assistant Response (Only if legitimate response)
      let savedAiMsg: any = null;
      if (userId && aiMessage && aiMessage.content) {
        savedAiMsg = await ChatMessageModel.create({
          userId,
          conversationId: activeConv?._id,
          role: "assistant",
          content: aiMessage.content,
          provider: usedProvider,
          model: usedModel,
          status: "sent",
        });

        await ConversationModel.findByIdAndUpdate(activeConv._id, {
          lastMessage: aiMessage.content,
          provider: usedProvider,
          model: usedModel,
        });
      }

      res.json({
        ...aiMessage,
        _id: savedAiMsg?._id,
        userMessageId: savedUserMsg?._id,
        usage,
        conversationId: activeConv?._id,
        provider: usedProvider,
        model: usedModel,
      });
    } catch (error: any) {
      console.error("AI Chat Error:", error?.message || error);
      res.status(500).json({
        message: "Internal server error in AI service.",
        error: error?.message || "Unknown error",
        provider: error?.provider || undefined,
      });
    }
  }

  // Delete a specific message
  static async deleteMessage(req: Request, res: Response) {
    try {
      const { messageId } = req.params;
      const result = await ChatMessageModel.findByIdAndDelete(messageId);
      if (!result)
        return res.status(404).json({ message: "Message not found." });
      res.json({ message: "Message deleted successfully." });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete a full conversation and its messages
  static async deleteConversation(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;

      // 1. Delete all messages associated with this conversation
      await ChatMessageModel.deleteMany({ conversationId });

      // 2. Delete the conversation record itself
      const result = await ConversationModel.findByIdAndDelete(conversationId);

      if (!result)
        return res.status(404).json({ message: "Conversation not found." });
      res.json({ message: "Conversation deleted successfully." });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get list of conversations for a user
  static async getConversations(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) return res.status(400).json({ message: "UserId required." });

      const list = await ConversationModel.find({ userId }).sort({
        updatedAt: -1,
      });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get messages for a specific conversation
  static async getConversationMessages(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const messages = await ChatMessageModel.find({ conversationId }).sort({
        createdAt: 1,
      });
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // DEPRECATED: Standard history (global user messages)
  static async getHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const history = await ChatMessageModel.find({
        userId,
        conversationId: null,
      }).sort({ createdAt: 1 });
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
export const aiCtlr = new AiController( );
