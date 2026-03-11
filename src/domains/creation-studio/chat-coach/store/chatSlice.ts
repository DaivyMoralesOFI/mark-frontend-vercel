// chatSlice.ts
//
// This file defines the Redux slice for managing chat state, messages, and async actions for the chat coach module.
// It handles sending messages to Mark AI, managing chat history, loading and error states, and user/assistant message logic.

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatHistoryItem, Message } from "../types/ChatTypes";
import { ChatService } from "@/domains/creation-studio/chat-coach/services/chatService";

/**
 * ChatState
 * Redux state shape for the chat coach slice.
 */
interface ChatState {
  messages: Message[];      // Array of chat messages
  isLoading: boolean;       // Loading state for sending messages
  error: string | null;     // Error message if sending fails
}

// Initial state for the chat coach slice
const initialState: ChatState = {
  messages: [
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm Mark AI, your digital marketing coach. I can help you with content strategies, social media advertising, copywriting, metrics analysis, and much more. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ],
  isLoading: false,
  error: null,
};

/**
 * Async thunk for sending a message to Mark AI.
 * Prepares the request payload and handles the response or error.
 */
export const sendMessageAsync = createAsyncThunk(
  'chat/sendMessage',
  async ({
    message,
    chatHistory
  }: {
    message: string;
    chatHistory: ChatHistoryItem[]
  }) => {
    const userId = 'user-' + Date.now();
    const timestamp = new Date().toISOString();

    const request = {
      query: message,
      chatHistory,
      userId,
      timestamp
    };

    const response = await ChatService.sendMessage(request);

    if (!response.success || !response.data) {
      throw new Error('Failed to get response from AI');
    }

    return response.data;
  }
);

/**
 * chatSlice
 *
 * Redux slice for chat coach, including reducers for user messages, error handling, and extraReducers for async thunks.
 * Handles chat history, loading, error, and assistant/user message logic.
 */
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /**
     * Adds a user message to the chat history.
     */
    addUserMessage: (state, action: PayloadAction<string>) => {
      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString()
      };
      state.messages.push(userMessage);
    },
    /**
     * Clears the error state.
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Resets the chat history to the initial state.
     */
    resetChat: (state) => {
      state.messages = initialState.messages;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle sendMessageAsync async thunk
      .addCase(sendMessageAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: action.payload.response,
          timestamp: action.payload.timestamp,
          tokens: action.payload.tokens_used
        };
        state.messages.push(assistantMessage);
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send message';

        // Add an error message to the chat
        const errorMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Sorry, there was a problem processing your request. Could you try again?',
          timestamp: new Date().toISOString(),
          isError: true
        };
        state.messages.push(errorMessage);
      });
  },
});

export const { addUserMessage, clearError, resetChat } = chatSlice.actions;
export default chatSlice.reducer;