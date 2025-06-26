// ScheduleModal.tsx
//
// This file defines the ScheduleModal component, which provides a modal dialog for scheduling a post.
// Users can select a date and time for the post, and confirm or cancel the scheduling action.
// The component displays a loading state during scheduling and validates the input before allowing confirmation.
// It is styled with Tailwind CSS and designed for use in post creation flows.

import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";

/**
 * Props for ScheduleModal
 * @property {boolean} isOpen - Controls whether the modal is open.
 * @property {() => void} onClose - Callback to close the modal.
 * @property {Date | undefined} scheduledDate - The selected date for scheduling the post.
 * @property {string} scheduledTime - The selected time for scheduling the post (in HH:mm format).
 * @property {boolean} loadingSchedule - Whether the scheduling action is currently loading.
 * @property {(date: Date | undefined) => void} onDateChange - Callback for when the date changes.
 * @property {(time: string) => void} onTimeChange - Callback for when the time changes.
 * @property {() => void} onConfirm - Callback to confirm scheduling.
 * @property {boolean} isValid - Whether the selected date and time are valid for scheduling.
 */
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledDate?: Date;
  scheduledTime: string;
  loadingSchedule: boolean;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
  isValid: boolean;
}

/**
 * ScheduleModal
 *
 * Renders a modal dialog for scheduling a post, with:
 * - Date picker (calendar)
 * - Time input
 * - Cancel and confirm buttons
 * - Loading spinner during scheduling
 * - Input validation before confirming
 *
 * Used in the CreatePostModal to allow users to schedule their post for a future date and time.
 */
export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  scheduledDate,
  scheduledTime,
  loadingSchedule,
  onDateChange,
  onTimeChange,
  onConfirm,
  isValid,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-gray-900">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Date selection section */}
          <div>
            <label className="block text-sm font-medium mb-1">Select date</label>
            <Calendar
              mode="single"
              selected={scheduledDate}
              onSelect={onDateChange}
              fromDate={new Date()}
            />
          </div>
          {/* Time selection section */}
          <div>
            <label className="block text-sm font-medium mb-1">Select time</label>
            <input
              type="time"
              className="border rounded px-3 py-2 w-full"
              value={scheduledTime}
              onChange={(e) => onTimeChange(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          {/* Cancel button */}
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loadingSchedule}
          >
            Cancel
          </Button>
          {/* Confirm button, disabled if input is invalid or loading */}
          <Button
            onClick={onConfirm}
            disabled={!isValid || loadingSchedule}
          >
            {loadingSchedule ? (
              <Loader className="animate-spin w-4 h-4 mr-2 text-green-600" />
            ) : null}
            Confirm Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
