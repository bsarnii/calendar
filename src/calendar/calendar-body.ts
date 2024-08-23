import {
  Component,
  input,
  PipeTransform,
  Pipe,
  Directive,
  inject,
  ViewContainerRef,
  ComponentRef,
  Input,
  effect,
  OnInit,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { DateTime } from 'luxon';
import { CalendarEvent } from './models/CalendarEvent';
import { CalendarEventBox } from './calendar-event-box';

function createHours() {
  const workingHours: DateTime[] = [];
  let next = DateTime.now().set({
    hour: 8,
    minute: 0,
    second: 0,
    millisecond: 0
  });

  while (next.hour <= 18) {
    workingHours.push(next);
    next = next.plus({ hour: 1 });
  }
  return workingHours;
}

@Pipe({
  standalone: true,
  name: 'formatHour',
})
export class FormatHour implements PipeTransform {
  transform(date: DateTime): string {
    return date.toFormat('h a');
  }
}

@Directive({
  standalone: true,
  selector: '[kj-calendar-body]',
})
export class CalendarEvents {
  vcr = inject(ViewContainerRef);
  events = input<Event[]>([]);
  days = input<DateTime[]>([]);

  constructor() {}
}

@Directive({
  standalone: true,
  selector: '[todayBar]',
})
export class TodayBar {
  vcr = inject(ViewContainerRef);
  days = input<DateTime[]>([]);

  private ref!: ComponentRef<CalendarTodayBar>;

  get instance() {
    return this.ref.instance;
  }

  constructor() {
    effect(() => {
      const days = this.days();
      this.startRenderingBar(days);
    });
  }

  startRenderingBar(days: DateTime[]) {
    if (!days) return;
    if (!this.ref) {
      this.ref = this.vcr.createComponent(CalendarTodayBar);
    }
    this.updatePosition(days);
  }

  updatePosition(days: DateTime[]) {
    const position = this.getPosition(days);
    const dashedPosition = this.getDashedPosition(days);
    this.ref.setInput('position', position);
    this.ref.setInput('dashedPosition', dashedPosition);
  }

  getPosition(days: DateTime[]): Position | null {
    const todayIndex = this.hasToday(days);
    if (todayIndex === -1) return null;

    const getWidth = () => {
      return `var(--kj-cell-width)`;
    };

    const getLeft = (order: number) => {
      return `calc((${order} * var(--kj-cell-width)) + var(--kj-empty-cell-width))`;
    };

    return {
      width: getWidth(),
      top: this.getTop(),
      left: getLeft(todayIndex),
    };
  }

  getDashedPosition(days: DateTime[]): Position | null {
    const todayIndex = this.hasToday(days);
    if (todayIndex === -1) return null;

    const getWidth = (order: number) => {
      return `calc(${order} * var(--kj-cell-width))`;
    };

    const getLeft = () => {
      return 'var(--kj-empty-cell-width)';
    };

    return {
      width: getWidth(todayIndex),
      top: this.getTop(),
      left: getLeft(),
    };
  }

  getTop() {
    const hour = DateTime.now().hour;
    const minute = DateTime.now().minute;
    const hoursFormula = `${hour - 8} * var(--kj-body-cell-height)`;
    const minuteRatio = `var(--kj-body-cell-height) / 60`;
    const miniutesFormula = `calc(${minuteRatio} * ${minute})`;
    return `calc(${hoursFormula} + ${miniutesFormula})`;
  }

  hasToday(days: DateTime[]) {
    const today = DateTime.now();
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      if (day.diff(today, ['days', 'hours']).days === 0) {
        return i;
      }
    }
    return -1;
  }
}

type Position = {
  top: string;
  left: string;
  width: string;
};

@Component({
  standalone: true,
  selector: 'kj-calendar-today-bar',
  imports: [JsonPipe],
  template: `
    <div class="dashed" [style.top]="dashedPosition?.top" [style.left]="dashedPosition?.left" [style.width]="dashedPosition?.width"></div>
    <div class="line" [style.top]="position?.top" [style.left]="position?.left" [style.width]="position?.width"></div>
    <div class="dot-container" [style.top]="position?.top" [style.left]="position?.left">
      <div class="dot"></div>
    </div>
  `,
})
export class CalendarTodayBar {
  @Input() position?: Position;
  @Input() dashedPosition?: Position;
}

@Component({
  standalone: true,
  selector: 'kj-calendar-body',
  imports: [FormatHour, TodayBar, JsonPipe, CalendarEventBox],
  template: `
  <div class="container" todayBar [days]="days()">
    @for (hour of hours; track hour) {
      <div class="row">
        <div class='cell'>
          <span class="mat-body-large hour">{{hour | formatHour}}</span>
          <div class="half-hour"></div>
        </div>
      @for (day of days(); track day) {
        <div class='cell'>
          @for(event of events(); track $index){
            @if(event.interval && event.interval.contains(getCalendarDayAndHour(day,hour))){
              @let height = event.interval.contains(getCalendarDayAndHour(day,hour)) && event.interval.contains(getCalendarDayAndHalfHour(day,hour)) ? '50%' : '100%';
              <kj-calendar-event-box [style]="{height}"/>
              {{height}}
            }
          }
          <div class="half-hour"></div>
        </div>
      }
    </div>
    }
  </div>
  `,
})
export class CalendarBody implements OnInit {
  hours = createHours();
  events = input<CalendarEvent[]>([]);
  days = input<DateTime[]>([]);

  getCalendarDayAndHour(dayDateTime:DateTime,hourDateTime:DateTime){
    const hour = hourDateTime.hour;
    const minute = hourDateTime.minute;
    const second = hourDateTime.second;
    const millisecond = hourDateTime.millisecond;
    const day = dayDateTime.set({hour, minute, second, millisecond});
    return day;
  }
  getCalendarDayAndHalfHour(dayDateTime:DateTime,hourDateTime:DateTime){
    const hour = hourDateTime.hour;
    const minute = 30;
    const second = hourDateTime.second;
    const millisecond = hourDateTime.millisecond;
    const day = dayDateTime.set({hour, minute, second, millisecond});
    return day;
  }

  constructor(){
    effect(() => {

    })
  }

  ngOnInit(){
    console.log('days:',this.days())
    console.log('hours:',this.hours)
    console.log('events:',this.events())
  }
}
