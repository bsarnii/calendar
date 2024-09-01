import { ComponentRef, Directive, effect, inject, input, ViewContainerRef } from "@angular/core";
import { DateTime } from "luxon";
import { CalendarTodayBarComponent, Position } from "../components/calendar-today-bar/calendar-today-bar.component";


@Directive({
    standalone: true,
    selector: '[todayBar]',
  })
  export class TodayBarDirective {
    vcr = inject(ViewContainerRef);
    days = input<DateTime[]>([]);
  
    private ref!: ComponentRef<CalendarTodayBarComponent>;
  
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
        this.ref = this.vcr.createComponent(CalendarTodayBarComponent);
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