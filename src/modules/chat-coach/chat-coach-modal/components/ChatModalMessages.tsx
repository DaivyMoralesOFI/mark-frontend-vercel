// ChatModalMessages.tsx
//
// This file defines the ChatModalMessages component, which displays a scrollable list of chat messages in the chat modal with Mark AI.
// It renders each message using ChatModalMessage, shows a typing indicator when the AI is responding, and auto-scrolls to the latest message.

import { useEffect, useRef } from "react";
import { MessageChatModal } from "../types/chatModalTypes";
import { ChatModalMessage } from "./ChatModalMessage";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { TypingIndicatorModal } from "./TypingIndicatorModal";

/**
 * Props for ChatModalMessages
 * @property {MessageChatModal[]} messages - Array of chat messages to display
 * @property {boolean} isTyping - Whether the AI is currently typing (shows typing indicator)
 */
interface ChatModalMessagesProps {
    messages: MessageChatModal[];
    isTyping: boolean;
  }
  
/**
 * ChatModalMessages
 *
 * Renders a scrollable list of chat messages, with:
 * - Each message rendered by ChatModalMessage
 * - Typing indicator when AI is responding
 * - Auto-scroll to the latest message
 */
  export const ChatModalMessages = ({ messages, isTyping }: ChatModalMessagesProps) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
  
    // Auto-scroll to the bottom when messages or typing state changes
    useEffect(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, [messages, isTyping]);
  
    return (
      <ScrollArea className="flex-1 min-h-0 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {/* Render each chat message */}
          {messages.map((message) => (
            <ChatModalMessage key={message.id} message={message} />
          ))}
          {/* Show typing indicator if AI is responding */}
          {isTyping && <TypingIndicatorModal />}
        </div>
      </ScrollArea>
    );
  };