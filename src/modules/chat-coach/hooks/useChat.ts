// useChat.ts
//
// This file defines the useChat custom React hook, which manages chat state and actions for the chat coach module.
// It integrates with Redux for state management and provides functions for sending messages, clearing errors, and resetting chat history.

import { RootState } from '@/core/store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { addUserMessage, clearError, resetChat, sendMessageAsync } from '../store/chatSlice';
import { ChatHistoryItem } from '../types/ChatTypes';

/**
 * useChat
 *
 * Custom hook that manages chat state and actions.
 * Integrates with Redux and provides:
 * - messages: Array of chat messages
 * - isLoading: Loading state for sending messages
 * - error: Error state for chat
 * - sendMessage: Function to send a message (with chat history)
 * - clearChatError: Function to clear the error state
 * - resetChatHistory: Function to reset the chat history
 *
 * Used in the chat coach module to power the chat UI.
 */
export const useChat = () => {
  const dispatch = useDispatch();
  const { messages, isLoading, error } = useSelector((state: RootState) => state.chat);

  /**
   * Sends a message to the chat assistant, including the last 5 messages as chat history.
   * Adds the user message immediately, then dispatches the async thunk.
   * @param {string} message - The message to send
   */
  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message immediately
    dispatch(addUserMessage(message));

    // Prepare chat history (last 5 messages)
    const chatHistory: ChatHistoryItem[] = messages.slice(-5).map((msg) => ({
      role: msg.role,
      content: msg.content
    }));

    // Send to AI
    dispatch(sendMessageAsync({ message, chatHistory }) as any);
  };

  /**
   * Clears the chat error state.
   */
  const clearChatError = () => {
    dispatch(clearError());
  };

  /**
   * Resets the chat history to the initial state.
   */
  const resetChatHistory = () => {
    dispatch(resetChat());
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChatError,
    resetChatHistory
  };
};