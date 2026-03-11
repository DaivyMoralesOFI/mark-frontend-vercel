// ChatMessage.tsx
//
// This file defines the ChatMessage component, which displays a single chat message in the chat coach module.
// It supports user and assistant messages, error messages, and Markdown rendering for assistant responses.
// The component is styled with Tailwind CSS and visually distinguishes between user, assistant, and error messages.

import { User } from "lucide-react";
import { Message } from "../types/ChatTypes";
import ReactMarkdown from "react-markdown";

/**
 * Props for ChatMessage
 * @property {Message} message - The message object to display
 */
interface ChatMessageProps {
  message: Message;
}

/**
 * ChatMessage
 *
 * Renders a single chat message, with:
 * - User and assistant avatars
 * - Markdown rendering for assistant messages
 * - Error message styling
 * - Timestamp display
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar for user or assistant */}
        <div className={`p-2 rounded-full ${isUser ? 'bg-purple-500' : isError ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <img src="/mark-magic-wand.png" alt="Mark" className="w-12 h-12 rounded-full" />
          )}
        </div>
        {/* Message content */}
        <div className={`p-4 rounded-2xl ${isUser ? 'bg-purple-500 text-white' : isError ? 'bg-red-50 border border-red-200' : 'bg-white shadow-md border border-gray-200'}`}>
          <div className="prose prose-sm max-w-none text-gray-800">
            {/* Assistant message with Markdown, or plain text for user/error */}
            {!isUser && !isError ? (
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            ) : (
              message.content.split('\n').map((line, index) => (
                <p key={index} className={`${index === 0 ? '' : 'mt-2'} ${isUser ? 'text-white' : isError ? 'text-red-700' : 'text-gray-800'}`}>
                  {line}
                </p>
              ))
            )}
          </div>
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
