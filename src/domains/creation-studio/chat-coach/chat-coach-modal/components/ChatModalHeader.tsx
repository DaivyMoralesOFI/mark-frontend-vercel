// ChatModalHeader.tsx
//
// This file defines the ChatModalHeader component, which displays the header for the chat modal with Mark AI.
// It shows the bot avatar, the chat title, and an online status indicator.



/**
 * ChatModalHeader
 *
 * Renders the header for the chat modal, including:
 * - Bot avatar with gradient background
 * - Title "Chat with Mark"
 * - Online status indicator
 */
export const ChatModalHeader = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* Bot avatar */}
      <img src="/mark-magic-wand.png" alt="Mark" className="w-11 h-11 rounded-full" />
      {/* Chat title */}
      <span className="text-gray-900">Chat with Mark</span>
      {/* Online status indicator */}
      <div className="flex items-center space-x-1 text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-xs">Online</span>
      </div>
    </div>
  );
};