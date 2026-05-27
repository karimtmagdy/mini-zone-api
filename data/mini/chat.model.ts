import { model, Schema, Types } from "mongoose";
import { getSchemaOptions } from "./standard.fields.js";
import {
  ROLE_STATUS,
  MESSAGE_STATUS,
  MessageEnum,
  IChatMessage,
} from "../unity/types/ai.types.js";

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: String, required: true, index: true },
    conversationId: { type: Types.ObjectId, ref: "Conversation", index: true },
    role: { type: String, enum: ROLE_STATUS, required: true },
    content: { type: String, required: true, trim: true },
    provider: { type: String },
    model: { type: String },
    status: {
      type: String,
      enum: MESSAGE_STATUS,
      default: MessageEnum.SENT,
    },
  },
  getSchemaOptions("chat_messages"),
);

export const ChatMessageModel = model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema,
);
