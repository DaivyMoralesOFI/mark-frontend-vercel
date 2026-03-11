import { useState } from "react";
import { format, subDays, startOfToday, endOfToday, startOfYesterday, endOfYesterday, subMonths, subYears } from "date-fns";
import { Calendar } from "@/shared/components/ui/Calendar";
import { Button } from "@/shared/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/shared/components/ui/Dialog";
import { cn } from "@/shared/utils/utils";
import { DateRange } from "react-day-picker";

interface DashboardDateRangePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (range: { start?: Date; end?: Date }) => void;
}

const presets = [
    { label: "Today", getValue: () => ({ from: startOfToday(), to: endOfToday() }) },
    { label: "Yesterday", getValue: () => ({ from: startOfYesterday(), to: endOfYesterday() }) },
    { label: "Last 7 days", getValue: () => ({ from: subDays(startOfToday(), 7), to: endOfToday() }) },
    { label: "Last 30 days", getValue: () => ({ from: subDays(startOfToday(), 30), to: endOfToday() }) },
    { label: "Last 6 months", getValue: () => ({ from: subMonths(startOfToday(), 6), to: endOfToday() }) },
    { label: "Last year", getValue: () => ({ from: subYears(startOfToday(), 1), to: endOfToday() }) },
    { label: "All time", getValue: () => ({ from: new Date(2020, 0, 1), to: endOfToday() }) },
];

export const DashboardDateRangePicker = ({
    isOpen,
    onClose,
    onSelect,
}: DashboardDateRangePickerProps) => {
    const [range, setRange] = useState<DateRange | undefined>({
        from: new Date(2024, 4, 15),
        to: new Date(2024, 5, 15),
    });
    const [activePreset, setActivePreset] = useState("Last 30 days");

    const handleApply = () => {
        onSelect({ start: range?.from, end: range?.to });
        onClose();
    };

    const handlePresetClick = (preset: typeof presets[0]) => {
        setActivePreset(preset.label);
        setRange(preset.getValue());
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[850px] p-0 overflow-hidden bg-white dark:bg-surface-container-low border-outline-variant rounded-2xl">
                <DialogTitle className="sr-only">Date Range Picker</DialogTitle>

                <div className="flex min-h-[400px]">
                    {/* Sidebar Presets */}
                    <div className="w-[180px] border-r border-gray-100 dark:border-outline-variant py-4 flex flex-col gap-1">
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => handlePresetClick(preset)}
                                className={cn(
                                    "px-6 py-2 text-left text-sm transition-colors mx-2 rounded-lg",
                                    activePreset === preset.label
                                        ? "bg-gray-100 dark:bg-surface-bright text-on-surface font-medium"
                                        : "text-on-surface-variant hover:bg-gray-50 dark:hover:bg-surface-container/50 font-normal"
                                )}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    {/* Calendars Content */}
                    <div className="flex-1 flex flex-col">
                        <div className="p-4 flex-1">
                            <Calendar
                                mode="range"
                                selected={range}
                                onSelect={(newRange) => {
                                    setRange(newRange);
                                    setActivePreset(""); // Reset preset if user manually interacts
                                }}
                                numberOfMonths={2}
                                className="p-0 pointer-events-auto"
                                classNames={{
                                    months: "flex flex-row gap-8",
                                    month: "space-y-4",
                                    caption: "flex justify-center pt-1 relative items-center",
                                    caption_label: "text-sm font-medium text-gray-900 dark:text-on-surface",
                                    nav: "space-x-1 flex items-center",
                                    table: "w-full border-collapse space-y-1",
                                    head_row: "flex",
                                    head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.75rem] h-9 flex items-center justify-center dark:text-on-surface-variant uppercase",
                                    row: "flex w-full mt-2",
                                    cell: cn(
                                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                        "[&:has([data-range-middle=true])]:!bg-blue-50 dark:[&:has([data-range-middle=true])]:!bg-blue-900/30",
                                        "[&:has([data-range-start=true])]:!bg-transparent",
                                        "[&:has([data-range-end=true])]:!bg-transparent"
                                    ),
                                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 dark:text-on-surface hover:!bg-gray-100 dark:hover:!bg-surface-container rounded-md transition-colors",
                                    range_start: "!bg-blue-600 !text-white !rounded-lg",
                                    range_end: "!bg-blue-600 !text-white !rounded-lg",
                                    range_middle: "!bg-transparent !text-blue-600 dark:!text-blue-400 !font-semibold",
                                    today: "!bg-transparent !text-blue-600 !font-bold",
                                    outside: "text-gray-300 dark:text-gray-600 opacity-50",
                                    disabled: "text-gray-300 dark:text-gray-600 opacity-50",
                                    hidden: "invisible",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-outline-variant flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="px-4 py-2 border border-gray-200 dark:border-outline-variant rounded-xl text-sm font-medium w-[120px] text-center bg-white dark:bg-surface">
                            {range?.from ? format(range.from, "d MMM") : "Start date"}
                        </div>
                        <span className="text-gray-400">—</span>
                        <div className="px-4 py-2 border border-gray-200 dark:border-outline-variant rounded-xl text-sm font-medium w-[120px] text-center bg-white dark:bg-surface">
                            {range?.to ? format(range.to, "d MMM") : "End date"}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl px-8 border-gray-200 dark:border-outline-variant hover:bg-gray-50 dark:hover:bg-surface-container"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-10 transition-colors shadow-sm"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
