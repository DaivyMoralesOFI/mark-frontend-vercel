// AiChatModal.tsx
//
// This file defines the AiChatModal component, which renders a modal dialog for interacting with Mark AI in a chat interface.
// It integrates chat state, input handling, suggested questions, error display, and message rendering for a complete chat experience.

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useChatModal } from "../hooks/useChatModal";
import { useChatInput } from "../hooks/useChatModalInput";
import { ChatModalHeader } from "../components/ChatModalHeader";
import { SuggestedQuestions } from "../components/SuggestedQuestions";
import { ChatModalInput } from "../components/ChatModalInput";
import { ErrorMessage } from "../components/ErrorMessage";
import { ChatModalMessages } from "../components/ChatModalMessages";

/**
 * Props for AiChatModal
 * @property {boolean} isOpen - Controls whether the modal is open
 * @property {() => void} onClose - Callback to close the modal
 */
interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AiChatModal
 *
 * Renders a modal dialog for chatting with Mark AI, including:
 * - Chat message list
 * - Suggested questions
 * - Error display
 * - Input for sending messages
 *
 * Used as a modal in the app to provide AI chat assistance.
 */
export function AiChatModal({ isOpen, onClose }: AiChatModalProps) {
  // Chat state and actions from the useChatModal hook
  const { messages, isTyping, error, sendMessage, clearError } = useChatModal();
  // Input state and handlers from the useChatInput hook
  const {
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
    setSuggestedQuestion,
  } = useChatInput(sendMessage);

  // True if only the initial message is present
  const isInitialState = messages.length === 1;
  // Disable input if empty or AI is typing
  const isInputDisabled = !inputValue.trim() || isTyping;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <ChatModalHeader />
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col text-gray-900">
          {/* List of chat messages */}
          <ChatModalMessages messages={messages} isTyping={isTyping} />

          {/* Suggested questions if only the initial message is present */}
          {isInitialState && (
            <SuggestedQuestions onQuestionSelect={setSuggestedQuestion} />
          )}

          {/* Error message if present */}
          {error && (
            <ErrorMessage error={error} onDismiss={clearError} />
          )}

          {/* Input for sending messages */}
          <ChatModalInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            disabled={isInputDisabled}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
