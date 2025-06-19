// AISuggestion.tsx
// This React functional component displays an AI-generated suggestion for optimal posting times and strategies.
// It is styled with Tailwind CSS classes and is intended to provide actionable insights to the user.
// The suggestion is currently static but can be extended to accept dynamic data in the future.
export const AISuggestion: React.FC = () => {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Mark's Suggestion
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Based on your audience engagement, posting between 2-4 PM on
              weekdays typically gets 23% more engagement. Consider adding
              relevant hashtags for better reach.
            </p>
          </div>
        </div>
      </div>
    );
  };