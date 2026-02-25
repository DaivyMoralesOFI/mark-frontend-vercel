// TypingIndicatorModal.tsx
//
// This file defines the TypingIndicatorModal component, which displays an animated typing indicator when the AI assistant is generating a response in the chat modal.
// The indicator uses animated dots and a bot avatar for visual feedback, styled with Tailwind CSS.

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Bot } from "lucide-react";

/**
 * TypingIndicatorModal
 *
 * Renders an animated typing indicator with a bot avatar and bouncing dots.
 * Used to show that the AI assistant is generating a response in the chat modal.
 */
export const TypingIndicatorModal = () => {
    return (
      <div className="flex justify-start">
        <div className="flex space-x-2 max-w-[80%]">
          {/* Bot avatar */}
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {/* Animated dots */}
          <div className="bg-gray-100 rounded-lg px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };