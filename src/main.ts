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
  <kj-calendar/>
  `,
  imports: [Calendar],
})
export class App {
  name = 'Angular';
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
