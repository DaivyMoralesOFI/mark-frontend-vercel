// TypingIndicator.tsx
//
// This file defines the TypingIndicator component, which displays an animated indicator when the AI assistant is "thinking" or generating a response in the chat coach module.
// The indicator uses animated dots and a bot icon for visual feedback, styled with Tailwind CSS.

import React from 'react';
import { Bot } from 'lucide-react';

/**
 * TypingIndicator
 *
 * Renders an animated typing indicator with a bot icon and bouncing dots.
 * Used to show that the AI assistant is generating a response.
 */
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-3xl">
        {/* Bot avatar */}
        <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
          <Bot className="w-5 h-5 text-white" />
        </div>
        {/* Animated dots and label */}
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-gray-500 text-sm">Thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};