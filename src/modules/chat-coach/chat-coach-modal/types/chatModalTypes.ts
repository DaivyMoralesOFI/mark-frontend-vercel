// chatModalTypes.ts
//
// This file defines TypeScript types and interfaces for the chat modal with Mark AI.
// It includes the shape of chat messages, chat history items, and request/response types for interacting with the Mark AI backend in the modal.

/**
 * MessageChatModal
 * Represents a single chat message in the chat modal.
 */
export interface MessageChatModal {
    id: string;                 // Unique identifier for the message
    type: "user" | "ai";        // Who sent the message
    content: string;            // Message content
    timestamp: string;          // ISO string timestamp
  }
  
/**
 * ChatHistoryModal
 * Represents a message in the chat history sent to the backend.
 */
export interface ChatHistoryModal {
    role: "user" | "assistant"; // Who sent the message
    content: string;             // Message content
  }
  
/**
 * ChatRequestModal
 * Payload for sending a message to the Mark AI backend.
 */
export interface ChatRequestModal {
    query: string;                 // The user's message
    chatHistory: ChatHistoryModal[];// Last N messages for context
    userId: string;                // Unique user identifier
    timestamp: string;             // ISO string timestamp
  }
  
/**
 * ChatResponseModal
 * Response from the Mark AI backend after sending a message.
 */
export interface ChatResponseModal {
    success: boolean;              // Whether the request was successful
    data?: {
      response: string;            // Assistant's response
    };
    error?: string;                // Error message if request failed
  }

/**
 * SUGGESTED_QUESTIONS
 * List of suggested questions for the chat modal.
 */
export const SUGGESTED_QUESTIONS = [
    "What's the best time to post on Instagram?",
    "How can I improve my engagement rate?",
    "Analyze my recent campaign performance",
    "Suggest content ideas for next week",
  ];