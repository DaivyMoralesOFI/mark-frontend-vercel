// AISuggestion.tsx
// This React functional component displays an AI-generated suggestion for optimal posting times and strategies.
// It is styled with Tailwind CSS classes and is intended to provide actionable insights to the user.
// The suggestion is currently static but can be extended to accept dynamic data in the future.
export const AISuggestion: React.FC = () => {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <img src="/mark-magic-wand.png" alt="Mark" className="w-8 h-8 rounded-full" />
        <div>
          <p className="text-sm font-medium text-purple-900">
            Mark's Suggestion
          </p>
          <p className="text-sm text-purple-700 mt-1">
            Based on your audience engagement, posting between 2-4 PM on
            weekdays typically gets 23% more engagement. Consider adding
            relevant hashtags for better reach.
          </p>
        </div>
      </div>
    </div>
  );
};