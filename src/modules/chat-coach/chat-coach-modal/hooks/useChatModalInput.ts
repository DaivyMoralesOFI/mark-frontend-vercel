// useChatModalInput.ts
//
// This file defines the useChatInput custom React hook, which manages the input state and handlers for the chat modal input with Mark AI.
// It provides state and functions for handling input changes, sending messages, key presses, and setting suggested questions.

import { useState } from "react";

/**
 * useChatInput
 *
 * Custom hook that manages the input state and handlers for the chat modal input.
 * Provides:
 * - inputValue: The current input value
 * - setInputValue: Function to set the input value
 * - handleSendMessage: Function to send the message and clear the input
 * - handleKeyPress: Function to handle Enter key for sending
 * - setSuggestedQuestion: Function to set a suggested question as the input value
 *
 * Used in the chat modal input to manage user input and sending logic.
 */
export const useChatInput = (onSend: (message: string) => void) => {
    const [inputValue, setInputValue] = useState("");
  
    /**
     * Sends the message if not empty, then clears the input.
     */
    const handleSendMessage = () => {
      if (!inputValue.trim()) return;
      onSend(inputValue);
      setInputValue("");
    };
  
    /**
     * Handles Enter key press to send the message.
     */
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    };
  
    /**
     * Sets a suggested question as the input value.
     */
    const setSuggestedQuestion = (question: string) => {
      setInputValue(question);
    };
  
    return {
      inputValue,
      setInputValue,
      handleSendMessage,
      handleKeyPress,
      setSuggestedQuestion,
    };
  };