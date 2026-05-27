import { Types } from "mongoose";

export const ROLE_STATUS = ["user", "assistant", "system", "tool"] as const;
export type RoleStatus = (typeof ROLE_STATUS)[number];
export enum RoleEnum {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  TOOL = "tool",
}
export const MESSAGE_STATUS = [
  "sent",
  "received",
  "delivered",
  "read",
  "error",
] as const;
export type MessageStatus = (typeof MESSAGE_STATUS)[number];
export enum MessageEnum {
  SENT = "sent",
  RECEIVED = "received",
  DELIVERED = "delivered",
  READ = "read",
  ERROR = "error",
}
export interface IChatMessage {
  userId: string;
  conversationId: Types.ObjectId;
  role: RoleStatus;
  content: string;
  provider: string;
  model: string;
  status: MessageStatus;
}
export interface IConversation {
  userId: string;
  title: string;
  lastMessage: string;
  provider: string;
  model: string;
}
