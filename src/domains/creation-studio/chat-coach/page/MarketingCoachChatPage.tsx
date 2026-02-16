// MarketingCoachChatPage.tsx
//
// This file defines the MarketingCoachChatPage component, which serves as the main chat interface for interacting with Mark AI, the digital marketing coach.
// It integrates chat state, quick questions, message input, and a modal for creating posts. The page is styled with Tailwind CSS and uses a responsive layout.

import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { Actions } from "@/shared/types/types";
import { Plus } from "lucide-react";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { ChatMessagesList } from "../components/ChatMessagesList";
import { QuickQuestions } from "../components/QuickQuestions";
import { ChatInput } from "../components/ChatInput";
import { CreatePostModal } from "@/domains/creation-studio/post-creator/components/CreatePostModal";

/**
 * MarketingCoachChatPage
 *
 * Main chat page for interacting with Mark AI.
 * - Displays chat messages and input
 * - Shows quick questions for easy interaction
 * - Allows creating a new post via modal
 * - Responsive and styled for a modern chat experience
 */
const MarketingCoachChatPage: React.FC = () => {
  // Chat state and actions from the useChat hook
  const { messages, isLoading, sendMessage } = useChat();
  // State for showing the create post modal
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Define header actions for the page (create post)
  const pageActions: Actions[] = [
    {
      type: "button",
      children: "Create Post",
      icon: Plus,
      onClick: () => setShowCreatePost(true),
      variant: "default",
    }
  ];

  // Handler for sending a message
  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Handler for sending a quick question
  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  // Show quick questions if there is only one or no message
  const showQuickQuestions = messages.length <= 1;

  return (
    <>
      {/* Main layout with page title and actions */}
      <PageOutletLayout<"with-actions"> pageTitle="Chat with Mark AI" actions={pageActions}>
        <div className="col-span-12 w-full h-[calc(100vh-150px)] flex flex-col bg-gradient-to-br from-purple-50 to-pink-100">
          {/* List of chat messages */}
          <ChatMessagesList messages={messages} isLoading={isLoading} />

          {/* Quick questions for easy interaction */}
          {showQuickQuestions && (
            <QuickQuestions onQuestionClick={handleQuickQuestion} />
          )}

          {/* Input for sending messages */}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </PageOutletLayout>

      {/* Modal for creating a new post */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </>
  );
};

export default MarketingCoachChatPage;
