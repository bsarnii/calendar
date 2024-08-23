import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'kj-calendar-bar',
  imports: [],
  template: `
  <div class='cell'></div>
  @for (cell of cells; track cell) {
    <div class='cell'></div>
  }
  `,
})
export class CalendarBar {
  cells = [0, 0, 0, 0, 0, 0, 0];
}
