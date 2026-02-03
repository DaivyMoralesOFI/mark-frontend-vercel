export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const WEEKDAYS = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
}

export const getDaysInMonth = (year: number, month: number): CalendarDay[] => {
    const date = new Date(year, month, 1);
    const days: CalendarDay[] = [];

    // Get padding days from previous month
    const firstDayOfWeek = date.getDay();
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, daysInPrevMonth - i),
            isCurrentMonth: false,
            isToday: false
        });
    }

    // Get days of current month
    const lastDay = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    for (let i = 1; i <= lastDay; i++) {
        const currentDay = new Date(year, month, i);
        days.push({
            date: currentDay,
            isCurrentMonth: true,
            isToday: currentDay.toDateString() === today.toDateString()
        });
    }

    // Get padding days from next month to complete 42 cells (6 rows)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
        days.push({
            date: new Date(year, month + 1, i),
            isCurrentMonth: false,
            isToday: false
        });
    }

    return days;
};

export const getDaysInWeek = (date: Date): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        days.push({
            date: currentDay,
            isCurrentMonth: true, // In week view this is less relevant but kept for consistency
            isToday: currentDay.toDateString() === new Date().toDateString()
        });
    }

    return days;
};

