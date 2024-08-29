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
  computed,
} from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { DateTime, Interval } from 'luxon';
import { CalendarEvent } from './models/CalendarEvent';
import { CalendarEventBox } from './calendar-event-box';
import {Overlay, OverlayModule} from '@angular/cdk/overlay';
import { SaveEventOverlay } from './save-event-overlay';
import { generateRandomId } from '../common';

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
  selector: 'kj-calendar-clickable-cell',
  imports: [SaveEventOverlay, OverlayModule, CommonModule],
  template: `
    <div [class.opened]="isOverlayOpen" cdkOverlayOrigin #trigger="cdkOverlayOrigin" (click)="isOverlayOpen = !isOverlayOpen" [style]="{height: '100%', width: '100%'}"></div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOverlayOpen"
      (overlayOutsideClick)="isOverlayOpen = false"
      [cdkConnectedOverlayPositions]="[
        {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: 10
        },
        {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -10
        }
      ]"
      [cdkConnectedOverlayViewportMargin]="5"
      [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
    >
      <kj-save-event-overlay [start]="hour()"/>
      </ng-template>

  `,
})
export class ClickableCell {
  hour = input(0);
  overlay = inject(Overlay);

  isOverlayOpen = false;
  scrollStrategy = this.overlay.scrollStrategies.reposition();

}

@Component({
  standalone: true,
  selector: 'kj-calendar-body',
  imports: [FormatHour, TodayBar, JsonPipe, CalendarEventBox, OverlayModule, SaveEventOverlay, ClickableCell],
  template: `
  <div class="container" todayBar [days]="days()">
    <div class="column column-time-display">
        @for(hour of hours; track $index){
          <div class="cell cell-time-display">
          <span class="mat-body-large hour">{{hour | formatHour}}</span>
          </div>
        }
    </div>
    @for(day of dayIntervals(); let dayIndex = $index; track dayIndex){
      <div class="column day-column">
        @for(event of events(); track $index){
          @if(event && day.contains(event.start)){
            <kj-calendar-event-box [style]="{height: getEventBoxHeight(event.start,event.end), top: getTop(event.start)}">
              <p style='color: #fff'>Start: {{event.start.toFormat('HH:mm')}}</p>
              <p style='color: #fff'>End: {{event.end.toFormat('HH:mm')}}</p>
            </kj-calendar-event-box>
          }
        } 
        @for(hour of hours; track $index){
            <div class="cell">
              <kj-calendar-clickable-cell [hour]="hour.hour" class="cell-top" style="height: 50%"/>
              <div class="half-hour"></div>
              <kj-calendar-clickable-cell [hour]="hour.hour" class="cell-bottom" style="height: 50%"/>
            </div>
        }
      </div>
    }
  </div>
  `,
})
export class CalendarBody{
  hours = createHours();
  events = input<CalendarEvent[]>([]);
  days = input<DateTime[]>([]);

  isOpen = false;
  openedOverlayId = '';

  dayIntervals = computed(() => {
    return this.days().map(day => {
      const dayStart = day.set({hour:0, minute: 0, second: 0, millisecond: 0})
      const dayEnd = day.set({hour:23, minute: 59, second: 59, millisecond: 999})
      return Interval.fromDateTimes(dayStart,dayEnd);
    })

  })


  getTop(eventStart:DateTime) {
    const hour = eventStart.hour;
    const minute = eventStart.minute;
    const hoursFormula = `${hour - 8} * var(--kj-body-cell-height)`;
    const minuteRatio = `var(--kj-body-cell-height) / 60`;
    const minutesFormula = `calc(${minuteRatio} * ${minute})`;
    return `calc(${hoursFormula} + ${minutesFormula})`;
  }

  getEventBoxHeight(eventStart:DateTime, eventEnd:DateTime){
    const durationInMillis = Interval.fromDateTimes(eventStart,eventEnd).toDuration().milliseconds;
    const durationInMinutes = durationInMillis / 60000;
    const minuteRatio = `var(--kj-body-cell-height) / 60`;
    return `calc(${minuteRatio} * ${durationInMinutes})`;
  }

  onCellClick(id:string | null){
    console.log(id)
    id ? this.openedOverlayId = id : this.openedOverlayId = '';
  }

  generateRandomId = generateRandomId;
}
