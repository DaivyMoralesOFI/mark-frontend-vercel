interface ErrorStateProps {
    error: string;
    onRetry?: () => void;
  }
  
  export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        )}
      </div>
    );
  };