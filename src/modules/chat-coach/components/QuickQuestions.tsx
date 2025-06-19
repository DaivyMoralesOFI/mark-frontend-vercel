// QuickQuestions.tsx
//
// This file defines the QuickQuestions component, which displays a set of frequently asked questions as clickable suggestions for the chat coach module.
// Users can click a question to send it to the chat assistant. The component is styled with Tailwind CSS and includes a lightbulb icon for visual context.

import React from 'react';
import { Lightbulb } from 'lucide-react';

/**
 * Props for QuickQuestions
 * @property {(question: string) => void} onQuestionClick - Callback when a question is clicked
 */
interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

// List of frequently asked questions
const QUICK_QUESTIONS = [
  "How can I improve my Instagram strategy?",
  "Help me write a copy for Facebook Ads",
  "Which metrics should I monitor in my campaigns?",
  "Ideas for LinkedIn content"
];

/**
 * QuickQuestions
 *
 * Renders a list of frequently asked questions as clickable buttons.
 * Used to help users quickly interact with the chat assistant.
 */
export const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onQuestionClick }) => {
  return (
    <div className="px-4 pb-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2 mb-3">
          {/* Lightbulb icon and label */}
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Frequently asked questions:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Render each quick question as a button */}
          {QUICK_QUESTIONS.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question)}
              className="text-left text-gray-700 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-sm"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};