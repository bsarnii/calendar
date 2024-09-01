import { computed, Injectable, signal } from "@angular/core";
import { CalendarEventInputDTO, CalendarEventOutputDTO } from "../models/CalendarEventDTO";
import { DateTime } from "luxon";

@Injectable({providedIn: 'root'})
export class CalendarFacade{

    calendarEventDTOs = signal<CalendarEventOutputDTO[]>([]);
    calendarEvents = computed(() => this.calendarEventDTOs().map(event => ({
        ...event,
        start: DateTime.fromISO(event.start),
        end: DateTime.fromISO(event.end)
    })))

    //Faking the GET request
    loadCalendarEvents(){
        this.calendarEventDTOs.set([
            {
            id: 'test',
            start: '2024-08-26T08:00:00',
            end: '2024-08-26T08:30:00'
            },
            {
              id: 'test2',
              start: '2024-08-27T10:30:00',
              end: '2024-08-27T13:00:00'
            },
            {
              id: 'test3',
              start: '2024-08-28T14:00:00',
              end: '2024-08-28T15:15:00'
            },
            {
              id: 'test4',
              start: '2024-08-29T06:00:00',
              end: '2024-08-29T08:15:00'
            }
          ])
    };

    // Faking the POST request
    saveCalendarEvent(calendarEvent:CalendarEventInputDTO){
        const calendarEventWithId = {...calendarEvent, id: Math.floor(Math.random() * 1000).toString()}
        return this.calendarEventDTOs.update(events => [...events,calendarEventWithId])
    }
}