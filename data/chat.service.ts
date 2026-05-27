import { fn } from "../lib/utils";
import { ChatBot } from "../models/ChatBot";
import AppError from "../class/api-error";
import { Request, Response, NextFunction } from "express";
import { GoogleService } from "./chat/google.service";
import { GoogleGenAIResponse } from "../types/ChatAIType";
import { Types } from "mongoose";

export const createChat = fn(
  async (req: Request, res: Response, next: NextFunction) => {
    const { prompt } = req.body;
    const data: GoogleGenAIResponse = await GoogleService(req);

    const chat = await ChatBot.create({
      conversationId: new Types.ObjectId().toString(),
      messages: [
        { role: "user", content: prompt },
        { role: "model", content: data.text() },
      ],
      title: prompt.slice(0, 50),

      metadata: {
        modelVersion: data.modelVersion,
        promptTokenCount: data.usageMetadata.promptTokenCount,
        completionTokens: data.usageMetadata.candidatesTokenCount,
        totalTokenCount: data.usageMetadata.totalTokenCount,
        finishReason: data.candidates?.[0]?.finishReason,
        responseId: data.responseId,
      },
    });
    await chat.save();

    res.status(201).json({ chat });
  }
);

export const getChats = fn(async (req: Request, res: Response) => {
  const page: any = req.query.page || 1;
  const limit: any = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const total = await ChatBot.countDocuments();
  const chats = await ChatBot.find().skip(skip).limit(limit).lean().exec();
  // await chats.sort((a: any, b: any) => b.createdAt - a.createdAt);

  res.status(200).json({
    results: total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    chats,
  });
});

export const singleChat = fn(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const conversation = await ChatBot.findById(id);
    if (!conversation) return next(new AppError("chat not found", 404));
    await conversation.save();
    res.status(200).json({ status: "success", conversation });
  }
);

export const deleteChat = fn(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const chat = await ChatBot.findByIdAndDelete(id).select("messages");
    if (!chat) next(new AppError("chat not found", 404));
    res.status(200).json({ status: "success", message: "chat deleted" });
  }
);

export const updateChat = fn(
  async (req: Request<{ id: string }>, res: Response) => {
    const { prompt } = req.body;
    const data: GoogleGenAIResponse = await GoogleService(req);
    const { id } = req.params;
    const conversation = await ChatBot.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          messages: [
            { role: "user", content: prompt },
            { role: "model", content: data.text() },
          ],
        },
        $set: {
          // $setOnInsert: {
          title: prompt.slice(0, 50),
          metadata: {
            promptTokenCount: data.usageMetadata.promptTokenCount,
            completionTokens: data.usageMetadata.candidatesTokenCount,
            totalTokenCount: data.usageMetadata.totalTokenCount,
            finishReason: data.candidates?.[0]?.finishReason,
          },
        },
      },
      { new: true, upsert: true }
    );
    await conversation.save();
    res.status(201).json({ conversation });
  }
);

// export const getChatsByCategory = fn(async (req, res) => {
//   const { category } = req.params;
//   const chats = await ChatBot.find({ category });
//   res.status(200).json({ status: "success", chats });
// });
