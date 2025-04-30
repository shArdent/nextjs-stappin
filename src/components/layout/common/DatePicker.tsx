import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";

export function DatePicker({
    date,
    setDate,
    beforeDate,
    disableTrigger,
}: {
    beforeDate?: Date;
    date?: Date;
    setDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
    disableTrigger?: boolean;
}) {
    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    disabled={disableTrigger}
                    variant={"outline"}
                    className={cn(
                        "h-12 w-full justify-start rounded-sm border-black px-5 text-left font-normal disabled:text-black",
                        !date && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon />
                    {date ? (
                        format(date, "d MMMM yyyy", { locale: id })
                    ) : (
                        <span>Pilih tanggal</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={
                        beforeDate
                            ? (date) => date < beforeDate
                            : (date) => date < new Date()
                    }
                />
            </PopoverContent>
        </Popover>
    );
}
