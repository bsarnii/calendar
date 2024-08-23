import {
  Component,
  signal,
  computed,
  ChangeDetectorRef,
  inject,
  input,
} from '@angular/core';
import { DateTime } from 'luxon';
import { CalendarToolbar } from './calendar-toolbar';
import { CalendarBody } from './calendar-body';
import { CalendarHeader } from './calendar-header';
import { CalendarBar } from './calendar-bar';
import { CalendarEvent } from './models/CalendarEvent';

export type Range = { start: DateTime; end: DateTime };

@Component({
  standalone: true,
  selector: 'kj-calendar',
  template: `
    <kj-calendar-toolbar (rangeChanged)="onRangeChanged($event)"/>
    <div class="body-wrapper">
      <kj-calendar-header [dates]="days()"/>
      <kj-calendar-bar />
      <kj-calendar-body [events]="events()" [days]="days()"/>
    </div>
  `,
  imports: [CalendarToolbar, CalendarBody, CalendarHeader, CalendarBar],
})
export class Calendar {
  cdRef = inject(ChangeDetectorRef);
  currentRange = signal<Range>(null as any);
  days = computed(() => {
    const range = this.currentRange();

    if (!range) return [];

    const { start, end } = range;

    const dates = [start];
    let date: DateTime = start;
    let next: DateTime = start.plus({ day: 1 });

    while (end.diff(next, ['days']).days >= 0) {
      dates.push(next);
      next = next.plus({ days: 1 });
    }
    return dates;
  });
  events = input<CalendarEvent[]>([]);

  onRangeChanged(range: any) {
    if (range) this.currentRange.set(range);
  }
}
