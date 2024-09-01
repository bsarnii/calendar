import { JsonPipe } from "@angular/common";
import { Component, Input } from "@angular/core";

export type Position = {
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
  export class CalendarTodayBarComponent {
    @Input() position?: Position;
    @Input() dashedPosition?: Position;
  }