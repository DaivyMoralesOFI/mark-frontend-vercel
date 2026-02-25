// useChatModal.ts
//
// This file defines the useChatModal custom React hook, which manages chat state and actions for the chat modal with Mark AI.
// It integrates with Redux for state management and provides functions for sending messages, clearing errors, and resetting chat history.

import { AppDispatch } from "@/core/store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearError, resetChat, sendChatMessage } from "../store/chatModalSlice";
import { RootState } from "@/core/store/rootReducer";

/**
 * useChatModal
 *
 * Custom hook that manages chat state and actions for the chat modal.
 * Integrates with Redux and provides:
 * - messages: Array of chat messages
 * - isTyping: Whether the AI is currently typing
 * - error: Error state for chat
 * - sendMessage: Function to send a message
 * - clearError: Function to clear the error state
 * - resetChat: Function to reset the chat history
 *
 * Used in the chat modal to power the chat UI.
 */
export const useChatModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { messages, isTyping, error } = useSelector((state: RootState) => state.chatModal);
  
    /**
     * Sends a message to the chat assistant, including the current chat history.
     * Does nothing if the message is empty or the AI is typing.
     * @param {string} message - The message to send
     */
    const sendMessage = (message: string) => {
      if (!message.trim() || isTyping) return;
      dispatch(sendChatMessage({ message, chatHistory: messages }));
    };
  
    /**
     * Clears the chat error state.
     */
    const handleClearError = () => {
      dispatch(clearError());
    };
  
    /**
     * Resets the chat history to the initial state.
     */
    const handleResetChat = () => {
      dispatch(resetChat());
    };
  
    return {
      messages,
      isTyping,
      error,
      sendMessage,
      clearError: handleClearError,
      resetChat: handleResetChat,
    };
  };
  