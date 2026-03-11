// chatTypes.ts
//
// This file defines TypeScript types and interfaces for the chat coach module.
// It includes the shape of chat messages, chat history items, and request/response types for interacting with the Mark AI backend.

/**
 * Message
 * Represents a single chat message in the chat coach module.
 */
export interface Message {
    id: number;                 // Unique identifier for the message
    role: 'assistant' | 'user'; // Who sent the message
    content: string;            // Message content
    timestamp: string;          // ISO string timestamp
    isError?: boolean;          // True if this is an error message
    tokens?: number;            // (Optional) Number of tokens used (for assistant)
  }
  
/**
 * ChatHistoryItem
 * Represents a message in the chat history sent to the backend.
 */
export interface ChatHistoryItem {
    role: 'assistant' | 'user'; // Who sent the message
    content: string;            // Message content
  }
  
/**
 * SendMessageRequest
 * Payload for sending a message to the Mark AI backend.
 */
export interface SendMessageRequest {
    query: string;                 // The user's message
    chatHistory: ChatHistoryItem[];// Last N messages for context
    userId: string;                // Unique user identifier
    timestamp: string;             // ISO string timestamp
  }
  
/**
 * SendMessageResponse
 * Response from the Mark AI backend after sending a message.
 */
export interface SendMessageResponse {
    success: boolean;              // Whether the request was successful
    data?: {
      response: string;            // Assistant's response
      timestamp: string;           // Timestamp of the response
      tokens_used?: number;        // (Optional) Number of tokens used
    };
  }