import { Component, input } from '@angular/core';
import { IsTodayPipe, ToDayPipe } from '../../../util';
import { DateTime } from 'luxon';

@Component({
  standalone: true,
  selector: 'kj-calendar-header',
  imports: [ToDayPipe, IsTodayPipe],
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
export class CalendarHeaderComponent {
  dates = input<DateTime[]>();
}
