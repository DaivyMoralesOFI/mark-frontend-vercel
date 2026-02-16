// ErrorMessage.tsx
//
// This file defines the ErrorMessage component, which displays an error message with an optional dismiss button in the chat modal.
// It is used to show errors to the user in a clear and accessible way.

/**
 * Props for ErrorMessage
 * @property {string} error - The error message to display
 * @property {() => void} [onDismiss] - Optional callback to dismiss the error
 */
interface ErrorMessageProps {
    error: string;
    onDismiss?: () => void;
  }
  
/**
 * ErrorMessage
 *
 * Renders an error message with an optional dismiss button.
 * Used in the chat modal to show errors to the user.
 */
  export const ErrorMessage = ({ error, onDismiss }: ErrorMessageProps) => {
    return (
      <div className="text-red-600 text-sm mb-2 flex justify-between items-center">
        <span>{error}</span>
        {/* Dismiss button if provided */}
        {onDismiss && (
          <button onClick={onDismiss} className="text-xs underline ml-2">
            Dismiss
          </button>
        )}
      </div>
    );
  };