import { Component, input } from '@angular/core';
import { IsToday } from './pipes/isToday';
import { ToDay } from './pipes/toDay';
import { DateTime } from 'luxon';

@Component({
  standalone: true,
  selector: 'kj-calendar-header',
  imports: [ToDay, IsToday],
  template: `
  <div class='cell'></div>
  @for (date of dates(); track date) {
    <div class='cell'>
      <span class='mat-title-medium'>
        {{ date | toDay }}
      </span>
      <span class="day-container {{(date | isToday) ? 'is-today' : ''}}">
        <span class="mat-title-large">
        {{ date.day }}
        </span>
      </span>
  </div>
  }
  `,
})
export class CalendarHeader {
  dates = input<DateTime[]>();
}
