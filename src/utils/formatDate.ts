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