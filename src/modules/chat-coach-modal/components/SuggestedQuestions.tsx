// SuggestedQuestions.tsx
//
// This file defines the SuggestedQuestions component, which displays a list of suggested questions for the chat modal with Mark AI.
// Users can click a question to send it to the chat assistant. The component is styled with Tailwind CSS and includes a sparkles icon for visual context.

import { Sparkles } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "../types/chatModalTypes";

/**
 * Props for SuggestedQuestions
 * @property {(question: string) => void} onQuestionSelect - Callback when a question is selected
 */
interface SuggestedQuestionsProps {
    onQuestionSelect: (question: string) => void;
  }
  
/**
 * SuggestedQuestions
 *
 * Renders a list of suggested questions as clickable buttons.
 * Used to help users quickly interact with the chat assistant.
 */
  export const SuggestedQuestions = ({ onQuestionSelect }: SuggestedQuestionsProps) => {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 font-medium">Suggested questions:</p>
        <div className="grid grid-cols-1 gap-2">
          {/* Render each suggested question as a button */}
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => onQuestionSelect(question)}
              className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <Sparkles className="w-3 h-3 inline mr-2 text-blue-600" />
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  };