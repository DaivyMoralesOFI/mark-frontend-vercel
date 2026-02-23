import { useState } from "react";
import { format, subDays, startOfToday, endOfToday, startOfYesterday, endOfYesterday, subMonths, subYears } from "date-fns";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/shared/components/ui/dialog";
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

                <div className="flex min-h-[440px]">
                    {/* Sidebar Presets */}
                    <div className="w-[190px] border-r border-outline-variant py-6 px-2 flex flex-col gap-1.5 bg-surface-container-lowest/30">

                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => handlePresetClick(preset)}
                                className={cn(
                                    "px-6 py-2 text-left text-sm transition-colors mx-2 rounded-lg",
                                    activePreset === preset.label
                                        ? "bg-surface-container text-on-surface font-semibold"
                                        : "text-on-surface-variant hover:bg-surface-container/50 font-medium"
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
                                    caption: "flex justify-center pt-2 pb-4 relative items-center",
                                    caption_label: "text-base font-bold text-on-surface tracking-tight",
                                    nav: "space-x-1 flex items-center",
                                    table: "w-full border-collapse space-y-1",
                                    head_row: "flex mb-2",
                                    head_cell: "text-on-surface-variant rounded-md w-[2.6rem] font-bold text-[0.70rem] h-9 flex items-center justify-center uppercase tracking-wider",
                                    row: "flex w-full mt-2 gap-1",
                                    cell: cn(
                                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                        "[&:has([data-range-middle=true])]:!bg-primary/10",
                                        "[&:has([data-range-start=true])]:!bg-transparent",
                                        "[&:has([data-range-end=true])]:!bg-transparent"
                                    ),
                                    day: "h-[2.6rem] w-[2.6rem] p-0 font-medium aria-selected:opacity-100 text-on-surface hover:!bg-surface-container rounded-xl transition-all duration-200 cursor-pointer",
                                    range_start: "!bg-primary !text-on-primary !font-bold !rounded-2xl !shadow-md shadow-primary/30",
                                    range_end: "!bg-primary !text-on-primary !font-bold !rounded-2xl !shadow-md shadow-primary/30",
                                    range_middle: "!bg-transparent !text-primary !font-semibold !rounded-none",
                                    today: "!bg-surface-container-high !text-primary !font-bold !rounded-2xl",
                                    outside: "text-on-surface-variant/30 opacity-50",
                                    disabled: "text-on-surface-variant/30 opacity-50",
                                    hidden: "invisible",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest/50 backdrop-blur-md rounded-b-2xl">
                    <div className="flex items-center gap-3">
                        <div className="px-5 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold min-w-[130px] text-center bg-surface text-on-surface shadow-sm">
                            {range?.from ? format(range.from, "MMM dd, yyyy") : "Start date"}
                        </div>
                        <span className="text-on-surface-variant/50 font-bold">—</span>
                        <div className="px-5 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold min-w-[130px] text-center bg-surface text-on-surface shadow-sm">
                            {range?.to ? format(range.to, "MMM dd, yyyy") : "End date"}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl px-8 border-outline-variant hover:bg-surface-container hover:text-on-surface text-on-surface-variant font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="bg-primary hover:bg-primary/90 text-on-primary rounded-xl px-10 transition-colors shadow-lg shadow-primary/20 font-bold"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
