import { DateTime, Interval } from "luxon"

export interface CalendarEvent{
    id: string
    start: DateTime
    end: DateTime
    interval?: Interval
}