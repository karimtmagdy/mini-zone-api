import { Schema, model } from "mongoose";
import { IChat, ModelEnum, RoleEnum } from "../types/chat.ai.interface";
import slugify from "slugify";
// 1. Create a message schema
const MessageSchema = new Schema(
  {
    content: { type: String, trim: true, required: true },
    role: { type: String, required: true, enum: RoleEnum, default: "user" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);
// 2. Create a metadata schema
const MetadataSchema = new Schema(
  {
    modelVersion: { type: String, enum: ModelEnum },
    responseId: { type: String },
    promptTokenCount: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokenCount: { type: Number, default: 0 },
    finishReason: { type: String },
  },
  { _id: false }
);

// 3. Create a chatbot schema
const ChatBotSchema = new Schema<IChat>(
  {
    title: { type: String, trim: true },
    canUseBot: { type: Boolean, default: false },
    messages: [MessageSchema],
    // conversationId: { type: String, unique: true },
    slug: { type: String, lowercase: true, trim: true },
    metadata: [MetadataSchema],
  },
  { timestamps: false, collection: "chats" }
);
ChatBotSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
ChatBotSchema.pre<IChat>("save", function (next) {
  if (!this.title && this.messages?.length > 0) {
    this.title = this.messages[0]?.content?.slice(0, 50);
  }
  next();
});

export const ChatBot = model<IChat>("ChatBot", ChatBotSchema);
