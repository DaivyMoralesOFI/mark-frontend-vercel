// ChatModalInput.tsx
//
// This file defines the ChatModalInput component, which provides a text input and send button for the chat modal with Mark AI.
// It supports sending messages, handling input changes, and disabling input while typing.

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Send } from "lucide-react";

/**
 * Props for ChatModalInput
 * @property {string} value - The current input value
 * @property {(value: string) => void} onChange - Callback for input value change
 * @property {() => void} onSend - Callback to send the message
 * @property {(e: React.KeyboardEvent) => void} onKeyPress - Callback for key press events
 * @property {boolean} disabled - Whether the input and button are disabled
 */
interface ChatModalInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    disabled: boolean;
  }
  
/**
 * ChatModalInput
 *
 * Renders a text input and send button for the chat modal.
 * - Handles input changes and key presses
 * - Disables input and button when needed
 */
  export const ChatModalInput = ({ value, onChange, onSend, onKeyPress, disabled }: ChatModalInputProps) => {
    return (
      <div className="flex space-x-2">
        {/* User input field */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask Mark anything about your marketing..."
          onKeyPress={onKeyPress}
          className="flex-1"
        />
        {/* Send button */}
        <Button onClick={onSend} disabled={disabled} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    );
  };