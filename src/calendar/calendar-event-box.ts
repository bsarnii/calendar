import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'kj-calendar-event-box',
  imports: [],
  template: `
    <div role=button class="event-box">
      <ng-content></ng-content>
    </div>
  `,
})
export class CalendarEventBox {

}