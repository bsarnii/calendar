import {
  Component,
  signal,
  computed,
  inject
} from '@angular/core';
import { DateTime } from 'luxon';
import { CalendarToolbarComponent, CalendarBodyComponent, CalendarHeaderComponent, CalendarBarComponent  } from './ui';
import { CalendarFacade } from './data-access/calendar.facade';

export type Range = { start: DateTime; end: DateTime };

@Component({
  standalone: true,
  selector: 'kj-calendar',
  template: `
    <kj-calendar-toolbar (rangeChanged)="onRangeChanged($event)"/>
    <div class="body-wrapper">
      <kj-calendar-header [dates]="days()"/>
      <kj-calendar-bar />
      <kj-calendar-body (saveEvent)="this.facade.saveCalendarEvent($event)" [events]="this.facade.calendarEvents()" [days]="days()"/>
    </div>
  `,
  imports: [CalendarToolbarComponent, CalendarBodyComponent, CalendarHeaderComponent, CalendarBarComponent],
})
export class Calendar {
  facade = inject(CalendarFacade);
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

  ngOnInit(){
    this.facade.loadCalendarEvents();
  }

  onRangeChanged(range: any) {
    if (range) this.currentRange.set(range);
  }
}
