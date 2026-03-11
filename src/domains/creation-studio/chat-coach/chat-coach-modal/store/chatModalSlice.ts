// chatModalSlice.ts
//
// This file defines the Redux slice for managing chat state, messages, and async actions for the chat modal with Mark AI.
// It handles sending messages to Mark AI, managing chat history, loading and error states, and user/assistant message logic in the modal.

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MessageChatModal } from "../types/ChatModalTypes";
import { ChatModalService } from "../services/chatModalService";

/**
 * ChatState
 * Redux state shape for the chat modal slice.
 */
interface ChatState {
    messages: MessageChatModal[]; // Array of chat messages
    isTyping: boolean;            // Whether the AI is currently typing
    error: string | null;         // Error message if sending fails
  }
  
// Initial message from the AI assistant
const initialMessage: MessageChatModal = {
  id: "1",
  type: "ai",
  content: "Hi! I'm Mark, your AI marketing assistant. I can help you with campaign optimization, content strategy, audience insights, and more. What would you like to know?",
  timestamp: new Date().toISOString(),
};

// Initial state for the chat modal slice
const initialState: ChatState = {
  messages: [initialMessage],
  isTyping: false,
  error: null,
};

/**
 * Async thunk for sending a message to Mark AI in the modal.
 * Prepares the request payload and handles the response or error.
 */
export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, chatHistory }: { message: string; chatHistory: MessageChatModal[] }, { rejectWithValue }) => {
    try {
      const userMessage: MessageChatModal = {
        id: Date.now().toString(),
        type: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };

      const aiResponse = await ChatModalService.sendMessage(message, chatHistory);
      
      const aiMessage: MessageChatModal = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      return { userMessage, aiMessage };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : "Could not connect to the service. Check your connection and try again."
      );
    }
  }
);

/**
 * chatModalSlice
 *
 * Redux slice for the chat modal, including reducers for error handling and extraReducers for async thunks.
 * Handles chat history, typing state, error, and assistant/user message logic.
 */
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
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
      state.messages = [initialMessage];
      state.error = null;
      state.isTyping = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle sendChatMessage async thunk
      .addCase(sendChatMessage.pending, (state) => {
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        state.messages.push(action.payload.userMessage);
        state.messages.push(action.payload.aiMessage);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetChat } = chatSlice.actions;
export default chatSlice.reducer;  