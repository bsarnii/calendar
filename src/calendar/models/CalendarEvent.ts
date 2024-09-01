import { DateTime } from "luxon"

export interface CalendarEvent{
    id: string
    start: DateTime
    end: DateTime
}
