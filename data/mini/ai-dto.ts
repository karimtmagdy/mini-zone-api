import { Document } from "mongoose";
export const ModelEnum = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "deepseek/deepseek-r1:free",
] as const;
export enum RoleEnum {
  user = "user",
  model = "model",
}
export interface IChat extends Document {
  title?: string;
  canUseBot: boolean;
  messages: Array<{
    role: RoleEnum;
    content: string;
    createdAt: Date;
  }>;
  conversationId: string;
  slug: string;
  metadata: {
    modelVersion?: string;
    promptTokenCount: number;
    completionTokens: number;
    totalTokenCount: number;
    finishReason?: string;
    responseId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
// google.types.ts
export interface GoogleGenAIResponse {
  text: () => Promise<string>;
  modelVersion?: string;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  candidates?: Array<{
    finishReason?: string;
  }>;
  responseId?: string;
}
