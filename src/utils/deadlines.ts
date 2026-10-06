import {
    parseISO,
    format,
    differenceInDays,
    isPast,
    isToday
} from "date-fns";

import { sv } from "date-fns/locale";

export const getDeadlineInfo = (deadlineString: string) => {

    const deadline = parseISO(deadlineString);

    const formattedDeadline = format(
        deadline,
        "d MMMM yyyy",
        { locale: sv }
    );

    const daysLeft = differenceInDays(
        deadline,
        new Date()
    );

    let deadlineText = "";
    let deadlineStatus = "";

        if (isPast(deadline) && !isToday(deadline)) {
        deadlineText = "Delayed";
        deadlineStatus = "overdue";
    } else if (isToday(deadline)) {
        deadlineText = "Deadline today";
        deadlineStatus = "today";
    } else if (daysLeft <= 3) {
        deadlineText = `${daysLeft} days left`;
        deadlineStatus = "soon";
    } else {
        deadlineText = `${daysLeft} days left`;
        deadlineStatus = "normal";
    }

    return {
        formattedDeadline,
        deadlineText,
        daysLeft,
        deadlineStatus
    };
};