import { model, Schema } from "mongoose";
import { getSchemaOptions } from "./standard.fields.js";
import { IConversation } from "../unity/types/ai.types.js";

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: "New Conversation" },
    lastMessage: { type: String },
    provider: { type: String },
    model: { type: String },
  },
  getSchemaOptions("conversations"),
);

export const ConversationModel = model<IConversation>(
  "Conversation",
  ConversationSchema,
);
