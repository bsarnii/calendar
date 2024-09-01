import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Calendar } from './calendar';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { WeekRangeSelectionStrategyService } from './calendar/util/index';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
  <kj-calendar/>
  `,
  imports: [Calendar],
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App, {
  providers: [
    provideAnimationsAsync(),
    provideLuxonDateAdapter(),
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: WeekRangeSelectionStrategyService,
    },
  ],
});
