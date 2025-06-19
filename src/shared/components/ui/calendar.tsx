import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/core/lib/utils"
import { buttonVariants } from "@/shared/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6 w-full ", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2 m-auto w-full",
        month: "flex flex-col gap-2 w-full",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1 justify-start",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-4 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_previous: "absolute left-3 cursor-pointer",
        button_next: "absolute right-3 cursor-pointer",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-seconsadry-container rounded-md w-8 font-medium text-[0.8rem]",
        row: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-secondary-container [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        range_start:
          "day-range-start aria-selected:bg-secondary aria-selected:text-on-secondary",
        range_end:
          "day-range-end aria-selected:bg-secondary aria-selected:text-on-secondary",
        selected:
          "bg-secondary text-on-secondary hover:bg-secondary hover:text-on-secondary focus:bg-secondary focus:text-on-secondary",
        today: "bg-secondary text-on-secondary",
        outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-secondary-container aria-selected:text-on-secondary-container",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
       
      }}
      {...props}
    />
  )
}

export { Calendar }
