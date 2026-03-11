// ChatMessagesList.tsx
//
// This file defines the ChatMessagesList component, which displays a scrollable list of chat messages in the chat coach module.
// It renders each message using the ChatMessage component, shows a typing indicator when loading, and auto-scrolls to the latest message.
// The component is styled with Tailwind CSS and uses a ScrollArea for smooth scrolling.

import React from 'react';
import { ScrollArea } from '@/shared/components/ui/ScrollArea';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../types/ChatTypes';
import { useAutoScroll } from '../hooks/useAutoScroll';

/**
 * Props for ChatMessagesList
 * @property {Message[]} messages - Array of chat messages to display
 * @property {boolean} isLoading - Whether the chat is currently loading (shows typing indicator)
 */
interface ChatMessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

/**
 * ChatMessagesList
 *
 * Renders a scrollable list of chat messages, with:
 * - Each message rendered by ChatMessage
 * - Typing indicator when loading
 * - Auto-scroll to the latest message
 */
export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({ messages, isLoading }) => {
  const { ref } = useAutoScroll<HTMLDivElement>();

  return (
    <div className="flex-1 overflow-y-auto">
      <ScrollArea className="h-full pr-2 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4 w-full">
          {/* Render each chat message */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Show typing indicator if loading */}
          {isLoading && <TypingIndicator />}
          
          {/* Auto-scroll anchor */}
          <div ref={ref} />
        </div>
      </ScrollArea>
    </div>
  );
};