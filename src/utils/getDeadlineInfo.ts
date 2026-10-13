import {
    parseISO,
    differenceInDays,
    isPast,
    isToday
} from "date-fns";

import { formatDate } from "./formatDate";

export interface DeadlineInfo {
    formattedDeadline: string;
    deadlineText: string;
    text: string;
    colorClass: string;
    daysLeft: number;
    deadlineStatus: string;
}

export const getDeadlineInfo = (deadlineString: string): DeadlineInfo => {
    if (!deadlineString) {
        return {
            formattedDeadline: "No deadline",
            deadlineText: "No deadline",
            text: "No deadline",
            colorClass: "text-slate-400",
            daysLeft: Infinity,
            deadlineStatus: "none"
        };
    }

    const deadline = parseISO(deadlineString);
    const formattedDeadline = formatDate(deadlineString);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysLeft = differenceInDays(deadline, today);

    let deadlineText = "";
    let deadlineStatus = "";

    if (isPast(deadline) && !isToday(deadline)) {
        deadlineText = `${Math.abs(daysLeft)} days overdue`;
        deadlineStatus = "overdue";
    } else if (isToday(deadline)) {
        deadlineText = "Today";
        deadlineStatus = "today";
    } else {
        deadlineText = `${daysLeft} days left`;
        deadlineStatus = "normal";
    }

    // COLOR CODING BASED ON RULE:
    // ≤ 1 day: Critical (Red)
    // < 7 days (1 week): High (Orange)
    // < 30 days (1 month): Moderate (Yellow)
    // ≥ 30 dagar: Low (Green)
    let colorClass = "text-emerald-400"; // 🟢 Green (>= 30 days)

    if (daysLeft <= 1) {
        colorClass = "text-red-500"; // 🔴 Red (<= 1 day)
    } else if (daysLeft < 7) {
        colorClass = "text-orange-400"; // 🟠 Orange (< 1 week)
    } else if (daysLeft < 30) {
        colorClass = "text-amber-400"; // 🟡 Yellow (< 1 month)
    }

    const text = `Deadline: ${formattedDeadline} · ${deadlineText}`;

    return {
        formattedDeadline,
        deadlineText,
        text,
        colorClass,
        daysLeft,
        deadlineStatus
    };
};