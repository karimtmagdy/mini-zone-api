import OpenAI from "openai";
import { AiTools } from "./ai.tools.js";

type ProviderName = "openai" | "gemini" | "deepseek" | "grok";

interface AiProvider {
  name: string;
  type: ProviderName;
  model: string;
  client: OpenAI;
}

export class AiService {
  private providers: AiProvider[] = [];
  private currentProviderIndex: number = 0;

  constructor() {
    // 1. OpenAI
    if (process.env.OpenAiApiKey) {
      this.providers.push({
        name: "OpenAI",
        type: "openai",
        client: new OpenAI({ apiKey: process.env.OpenAiApiKey }),
        model: "gpt-4o-mini",
      });
    }

    // 2. Gemini — uses OpenAI-compatible endpoint
    if (process.env.GeminiApiKey) {
      this.providers.push({
        name: "Gemini",
        type: "gemini",
        client: new OpenAI({
          apiKey: process.env.GeminiApiKey,
          baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        }),
        model: "models/gemini-2.0-flash",
      });
    }

    // 3. DeepSeek — uses OpenAI-compatible endpoint
    if (process.env.DeepSeekApiKey) {
      this.providers.push({
        name: "DeepSeek",
        type: "deepseek",
        client: new OpenAI({
          apiKey: process.env.DeepSeekApiKey,
          baseURL: "https://api.deepseek.com",
        }),
        model: "deepseek-chat",
      });
    }

    // 4. Grok — uses OpenAI-compatible endpoint
    if (process.env.GrokApiKey) {
      this.providers.push({
        name: "Grok",
        type: "grok",
        client: new OpenAI({
          apiKey: process.env.GrokApiKey,
          baseURL: "https://api.x.ai/v1",
        }),
        model: "grok-2-1212",
      });
    }

    if (this.providers.length === 0) {
      console.error("No AI API keys found in environment variables.");
    } else {
      console.log(`[AI] Providers loaded: ${this.providers.map(p => p.name).join(", ")}`);
    }
  }

  private get currentProvider() {
    return this.providers[this.currentProviderIndex];
  }

  private switchProvider() {
    if (this.providers.length > 1) {
      this.currentProviderIndex =
        (this.currentProviderIndex + 1) % this.providers.length;
      console.log(`[AI] Switched to: ${this.currentProvider?.name}`);
      return true;
    }
    return false;
  }

  async chat(messages: any[], userId?: string, providerName?: string, modelName?: string): Promise<any> {
    // If a specific provider was requested, find and use it
    if (providerName) {
      const provider = this.providers.find(
        (p) => p.name.toLowerCase() === providerName.toLowerCase()
      );
      if (provider) {
        // Use custom model if provided, otherwise use the provider's default model
        const activeModel = modelName || provider.model;
        console.log(`[AI] Using requested provider: ${provider.name} (${activeModel})`);
        return await this._chat({ ...provider, model: activeModel }, messages);
      }
    }

    const provider = this.currentProvider;
    if (!provider) throw new Error("No AI providers configured.");

    try {
      console.log(`[AI] Using provider: ${provider.name} (${provider.model})`);
      return await this._chat(provider, messages);
    } catch (error: any) {
      const errorMsg = error?.message?.toLowerCase() || "";
      const status = error?.status || error?.response?.status;

      const shouldSwitch =
        status === 429 || // Quota
        status === 402 || // Insufficient balance
        status === 404 || // Model not found (common with Gemini versions)
        errorMsg.includes("quota") ||
        errorMsg.includes("insufficient_balance") ||
        errorMsg.includes("exhausted") ||
        errorMsg.includes("rate limit") ||
        errorMsg.includes("not found");

      if (shouldSwitch && !providerName) {
        console.warn(`[AI] ${provider.name} error (${status || errorMsg}). Switching provider...`);
        if (this.switchProvider()) {
          return await this.chat(messages, userId);
        }
      }
      
      // Attach provider info to error for better frontend debugging
      error.provider = provider.name;
      throw error;
    }
  }

  // All providers use the same OpenAI-compatible API
  private async _chat(provider: AiProvider, messages: any[]) {
    // 1. First call to get response/tool calls
    const response = await provider.client.chat.completions.create({
      model: provider.model,
      messages,
      tools: AiTools.getOpenAiTools() as any,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0]?.message;
    if (!responseMessage) throw new Error(`${provider.name} response empty`);

    // 2. If no tool calls, return response immediately with usage info
    if (!responseMessage.tool_calls || responseMessage.tool_calls.length === 0) {
      return {
        message: responseMessage,
        usage: response.usage,
        provider: provider.name,
        model: provider.model,
      };
    }

    // 3. Handle tool/function calls — CLONE messages to avoid polluting the retry history
    // We only mutate this local copy.
    const assistantMessage = {
      role: "assistant",
      content: responseMessage.content || "",
      tool_calls: responseMessage.tool_calls,
    };
    const localMessages = [...messages, assistantMessage];

    for (const toolCall of (responseMessage.tool_calls as any[])) {
      const name = toolCall.function?.name;
      if (!name) continue;

      let args = {};
      try {
        args = JSON.parse(toolCall.function?.arguments || "{}");
      } catch (e) {
        console.warn(`[AI] Failed to parse tool arguments for ${name}:`, e);
      }

      const result = await this._executeTool(name, args);

      localMessages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name,
        content: JSON.stringify(result),
      });
    }

    // 4. Second call with tool results
    const second = await provider.client.chat.completions.create({
      model: provider.model,
      messages: localMessages,
    });

    const finalMessage = second.choices[0]?.message;
    if (!finalMessage) throw new Error(`${provider.name} second response empty`);
    
    return {
      message: finalMessage,
      usage: second.usage,
      provider: provider.name,
      model: provider.model,
    };
  }

  private async _executeTool(name: string, args: any) {
    if (name === "getProducts") return await AiTools.getProducts(args);
    if (name === "getCategories") return await AiTools.getCategories();
    if (name === "getBrands") return await AiTools.getBrands();
    return "Function not found";
  }
}

export const aiService = new AiService();