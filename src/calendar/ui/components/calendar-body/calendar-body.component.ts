import {
  Component,
  input,
  computed,
  output,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { DateTime, Interval } from 'luxon';
import { CalendarEvent } from '../../../models/CalendarEvent';
import { CalendarEventBoxComponent } from '../calendar-event-box/calendar-event-box.component';
import { OverlayModule} from '@angular/cdk/overlay';
import { CalendarEventInputDTO } from '../../../models/CalendarEventDTO';
import { CellDateTimePipe, FormatHourPipe, createHours } from '../../../util';
import { TodayBarDirective } from '../../directives/today-bar.directive';
import { ClickableCellComponent } from '../calendar-clickable-cell/calendar-clickable-cell.component';
import { SaveEventOverlayComponent } from '../save-event-overlay/save-event-overlay.component';


@Component({
  standalone: true,
  selector: 'kj-calendar-body',
  imports: [FormatHourPipe, TodayBarDirective, JsonPipe, CalendarEventBoxComponent, OverlayModule, SaveEventOverlayComponent, ClickableCellComponent, CellDateTimePipe],
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
            </kj-calendar-event-box>
          }
        } 
        @for(hour of hours; track $index){
            <div class="cell">
              <kj-calendar-clickable-cell 
                (saveEvent)="saveEvent.emit($event)"
                [date]="day | cellDateTime:hour" 
                class="cell-top" 
                style="height: 50%"
              />
              <div class="half-hour"></div>
              <kj-calendar-clickable-cell 
                (saveEvent)="saveEvent.emit($event)"
                [date]="day | cellDateTime:hour:30" 
                class="cell-bottom" 
                style="height: 50%"
              />
            </div>
        }
      </div>
    }
  </div>
  `,
})


export class CalendarBodyComponent{
  hours = createHours();
  events = input<CalendarEvent[]>([]);
  days = input<DateTime[]>([]);
  saveEvent = output<CalendarEventInputDTO>();

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
}

