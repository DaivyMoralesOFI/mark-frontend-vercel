// ChatInput.tsx
//
// This file defines the ChatInput component, which provides a text input area for sending messages in the chat coach module.
// It supports sending messages with Enter, multi-line input with Shift+Enter, and disables input while loading.
// The component is styled with Tailwind CSS and includes a send button and usage hints.

import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

/**
 * Props for ChatInput
 * @property {(message: string) => void} onSendMessage - Callback to send a message
 * @property {boolean} isLoading - Whether the chat is currently loading
 */
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

/**
 * ChatInput
 *
 * Renders a textarea for user input and a send button.
 * - Sends message on Enter (single line), allows new lines with Shift+Enter
 * - Disables input and button while loading
 * - Shows usage hints and Mark AI branding
 */
export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  // Send the message if not empty and not loading
  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  // Handle Enter/Shift+Enter for sending or new line
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            {/* User input textarea */}
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your marketing question here..."
              className="w-full p-3 pr-12 text-gray-700 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 bg-purple-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Usage hints and Mark AI branding */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for a new line</span>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3" />
            <span>Mark AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};