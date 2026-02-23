"use client";

import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Field } from "@/shared/components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/Popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { cn } from "@/shared/utils/utils";

export function DatePickerWithRange({
    className,
    onSelect,
    customTrigger,
    initialRange
}: {
    className?: string;
    onSelect?: (range: DateRange | undefined) => void;
    customTrigger?: React.ReactNode;
    initialRange?: DateRange;
}) {
    const [date, setDate] = React.useState<DateRange | undefined>(initialRange);

    React.useEffect(() => {
        setDate(initialRange);
    }, [initialRange]);

    const handleSelect = (newDate: DateRange | undefined) => {
        setDate(newDate);
        if (onSelect) onSelect(newDate);
    };

    return (
        <Field className={cn("w-fit", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    {customTrigger ? (
                        <div role="button" className="cursor-pointer">
                            {customTrigger}
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            id="date-picker-range"
                            className={cn(
                                "justify-start px-4 font-normal text-left transition-all duration-300",
                                "bg-surface-container-low border-outline-variant/60 hover:bg-surface-container hover:border-outline-variant",
                                "h-11 min-w-[280px] rounded-2xl shadow-sm hover:shadow-md",
                                !date && "text-on-surface-variant"
                            )}
                        >
                            <CalendarIcon className="mr-3 h-4 w-4 text-on-surface-variant" />
                            {date?.from ? (
                                date.to ? (
                                    <span className="text-on-surface font-medium">
                                        {format(date.from, "MMM dd, yyyy")} <span className="text-on-surface-variant mx-1">—</span> {format(date.to, "MMM dd, yyyy")}
                                    </span>
                                ) : (
                                    <span className="text-on-surface font-medium">
                                        {format(date.from, "MMM dd, yyyy")}
                                    </span>
                                )
                            ) : (
                                <span>Pick a date range...</span>
                            )}
                        </Button>
                    )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-outline-variant/60 rounded-3xl shadow-2xl bg-surface/80 backdrop-blur-xl" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                        className="rounded-xl"
                    />
                </PopoverContent>
            </Popover>
        </Field>
    );
}
