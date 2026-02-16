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
                            className="justify-start px-3 font-normal bg-white dark:bg-surface-container-low border-outline-variant h-10 min-w-[260px] rounded-xl hover:bg-gray-50 dark:hover:bg-surface-container transition-colors"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-on-surface-variant" />
                            {date?.from ? (
                                date.to ? (
                                    <span className="text-on-surface">
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </span>
                                ) : (
                                    <span className="text-on-surface">
                                        {format(date.from, "LLL dd, y")}
                                    </span>
                                )
                            ) : (
                                <span className="text-on-surface-variant">Pick a date</span>
                            )}
                        </Button>
                    )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-outline-variant" align="end">
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
