// ChatModalMessage.tsx
//
// This file defines the ChatModalMessage component, which displays a single chat message in the chat modal with Mark AI.
// It supports user and AI messages, avatars, and timestamp formatting. The component is styled for clear distinction between user and AI messages.

import { Avatar, AvatarFallback } from "@/shared/components/ui/Avatar";
import { Bot, User } from "lucide-react";
import { MessageChatModal } from "../types/ChatModalTypes";

/**
 * Props for ChatModalMessage
 * @property {MessageChatModal} message - The message object to display
 */
interface ChatModalMessageProps {
    message: MessageChatModal;
  }
  
/**
 * ChatModalMessage
 *
 * Renders a single chat message, with:
 * - User or AI avatar
 * - Message content
 * - Timestamp formatted as HH:mm
 */
  export const ChatModalMessage = ({ message }: ChatModalMessageProps) => {
    return (
      <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex space-x-2 max-w-[80%] ${
            message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {/* Avatar for user or AI */}
          <Avatar className="w-8 h-8">
            <AvatarFallback
              className={
                message.type === "ai"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-200"
              }
            >
              {message.type === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
          {/* Message bubble */}
          <div
            className={`rounded-lg px-4 py-2 ${
              message.type === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="text-sm whitespace-pre-line">{message.content}</p>
            {/* Timestamp */}
            <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </div>
    );
  };