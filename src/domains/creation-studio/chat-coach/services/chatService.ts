// chatService.ts
//
// This file defines the ChatService class, which provides methods to send messages to the Mark AI backend for the chat coach module.
// It uses Axios for HTTP requests and is used by the Redux slice and hooks to interact with the AI assistant.

import axios from 'axios';
import { SendMessageRequest, SendMessageResponse } from '../types/ChatTypes';

// Webhook URL for the Mark AI backend
const N8N_WEBHOOK_URL = 'https://n8n.sofiatechnology.ai/webhook/marketing-coach';

/**
 * ChatService
 *
 * Provides static methods to send messages to the Mark AI backend.
 */
export class ChatService {
  /**
   * Sends a message to the Mark AI backend and returns the response.
   * @param {SendMessageRequest} request - The message request payload
   * @returns {Promise<SendMessageResponse>} - The response from the backend
   * @throws {Error} If the request fails
   */
  static async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await axios.post<SendMessageResponse>(N8N_WEBHOOK_URL, request, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}