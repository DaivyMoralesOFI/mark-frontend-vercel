// chatModalService.ts
//
// This file defines the ChatModalService class, which provides methods to send messages to the Mark AI backend for the chat modal.
// It uses Axios for HTTP requests and is used by the Redux slice and hooks to interact with the AI assistant in the modal.

import axios from "axios";
import { ChatHistoryModal, ChatRequestModal, ChatResponseModal, MessageChatModal } from "../types/chatModalTypes";

/**
 * ChatModalService
 *
 * Provides static methods to send messages to the Mark AI backend for the chat modal.
 */
export class ChatModalService {
  // Webhook URL for the Mark AI backend
  private static readonly WEBHOOK_URL = "https://n8n.sofiatechnology.ai/webhook/marketing-coach";

  /**
   * Sends a message to the Mark AI backend and returns the response string.
   * Prepares the chat history and request payload.
   * @param {string} message - The user's message
   * @param {MessageChatModal[]} chatHistory - The current chat history
   * @returns {Promise<string>} - The assistant's response
   * @throws {Error} If the request fails
   */
  static async sendMessage(
    message: string,
    chatHistory: MessageChatModal[]
  ): Promise<string> {
    const userMessage: MessageChatModal = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Prepare the chat history (last 5 messages)
    const formattedHistory: ChatHistoryModal[] = [...chatHistory, userMessage]
      .slice(-5)
      .map((msg) => ({
        role: msg.type === "ai" ? "assistant" : "user",
        content: msg.content,
      }));

    const request: ChatRequestModal = {
      query: message,
      chatHistory: formattedHistory,
      userId: "user-" + Date.now(),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post<ChatResponseModal>(
        this.WEBHOOK_URL,
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success && data.data) {
        return data.data.response;
      } else {
        throw new Error(data.error || "Error sending message");
      }
    } catch (error: any) {
      throw new Error(error?.message || "Network error sending message");
    }
  }
}