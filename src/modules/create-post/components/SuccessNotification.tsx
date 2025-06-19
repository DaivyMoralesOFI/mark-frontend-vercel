// SuccessNotification.tsx
//
// This file defines the SuccessNotification component, which displays a success message when a post is created successfully.
// The notification is styled with Tailwind CSS and appears with a fade-in animation. It is intended to be used in post creation flows.

/**
 * Props for SuccessNotification
 * @property {boolean} show - Controls whether the notification is visible.
 */
interface SuccessNotificationProps {
    show: boolean;
  }
  
/**
 * SuccessNotification
 *
 * Renders a green success notification banner when the 'show' prop is true.
 * Used in the CreatePostModal to inform the user that their post was created successfully.
 */
export const SuccessNotification: React.FC<SuccessNotificationProps> = ({ show }) => {
    // If 'show' is false, render nothing
    if (!show) return null;
  
    return (
      <div className="mb-4">
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-md text-center font-medium animate-fade-in">
          {/* Success message content */}
          !The post was created successfully!
        </div>
      </div>
    );
  };