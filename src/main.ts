import { Component, Injectable, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Calendar } from './calendar';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { WeekRangeSelectionStrategy } from './custom-date-strategy';
import { DateTime, Interval } from 'luxon';
import { CalendarEventOutputDTO } from './calendar/models/CalendarEventDTO';
import { CalendarEvent } from './calendar/models/CalendarEvent';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
  <kj-calendar [events]="testEvents"/>
  `,
  imports: [Calendar],
})
export class App {
  name = 'Angular';
  testEventsDTO:CalendarEventOutputDTO[] = [
    {
    id: 'test',
    start: '2024-08-20T08:00:00',
    end: '2024-08-20T08:30:00'
    },
    {
      id: 'test2',
      start: '2024-08-22T10:30:00',
      end: '2024-08-22T13:00:00'
    },
    {
      id: 'test3',
      start: '2024-08-19T14:00:00',
      end: '2024-08-19T15:15:00'
    }
  ];
  testEvents:CalendarEvent[] = [];

  ngOnInit(){
    this.testEvents = this.testEventsDTO.map(event => ({
        ...event,
        start: DateTime.fromISO(event.start),
        end: DateTime.fromISO(event.end),
        interval: Interval.fromDateTimes( DateTime.fromISO(event.start),  DateTime.fromISO(event.end))
      
    }))
  }
}

bootstrapApplication(App, {
  providers: [
    provideAnimationsAsync(),
    provideLuxonDateAdapter(),
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: WeekRangeSelectionStrategy,
    },
  ],
});
