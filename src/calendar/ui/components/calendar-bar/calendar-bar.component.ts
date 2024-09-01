import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'kj-calendar-bar',
  imports: [],
  template: `
  <div class='cell'></div>
  @for (cell of cells; track $index) {
    <div class='cell'></div>
  }
  `,
})
export class CalendarBarComponent {
  cells = [0, 0, 0, 0, 0, 0, 0];
}
