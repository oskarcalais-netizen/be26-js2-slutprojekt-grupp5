import {format} from "date-fns"
import { sv } from "date-fns/locale";

export const formatDate = (date?: string) => {
    if (!date) {
        return "-";
    }

    return format(new Date(date),  "d MMMM yyyy",
            { locale: sv }
    );
};

export const compareDates = (a?: string | Date, b?: string | Date): number => {
  const timeA = a ? new Date(a).getTime() : 0;
  const timeB = b ? new Date(b).getTime() : 0;
  return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
};