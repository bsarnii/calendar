import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component, output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Range } from '../../../calendar';
import { distinctUntilChanged } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { WeekRangeSelectionStrategyService } from '../../../util';

@Component({
  standalone: true,
  selector: 'kj-calendar-toolbar',
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  template: `
    <button mat-icon-button (click)="lastWeek()">
      <mat-icon>chevron_left</mat-icon>
    </button>
    <button mat-icon-button  (click)="nextWeek()">
      <mat-icon>chevron_right</mat-icon>
    </button>

    <mat-form-field>
      <mat-label>Enter a date range</mat-label>
      <mat-date-range-input [formGroup]="rangeFormGroup" [rangePicker]="picker">
        <input matStartDate formControlName="start" placeholder="Start date">
        <input matEndDate formControlName="end" placeholder="End date">
      </mat-date-range-input>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
  `,
})
export class CalendarToolbarComponent {
  dateStrategy = inject(
    MAT_DATE_RANGE_SELECTION_STRATEGY
  ) as WeekRangeSelectionStrategyService<DateTime>;
  rangeChanged = output<Range>();
  rangeFormGroup = new FormGroup({
    start: new FormControl<DateTime | null>(null),
    end: new FormControl<DateTime | null>(null),
  });

  constructor() {
    this.rangeFormGroup.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((values) => {
        if (!values) return;
        const { start, end } = values;

        if (!start || !end) return;
        this.rangeChanged.emit(values as any);
      });
    setTimeout(() => {
      this.initForm();
    });
  }

  initForm() {
    const newRange = this.dateStrategy.createPreview(DateTime.now());
    this.rangeFormGroup.patchValue(newRange);
  }

  lastWeek() {
    const currentRange = this.rangeFormGroup.getRawValue();
    const newRange = this.dateStrategy.createPreview(
      currentRange.start!.minus({ days: 7 })
    );
    this.rangeFormGroup.patchValue(newRange);
  }

  nextWeek() {
    const currentRange = this.rangeFormGroup.getRawValue();
    const newRange = this.dateStrategy.createPreview(
      currentRange.start!.plus({ days: 7 })
    );
    this.rangeFormGroup.patchValue(newRange);
  }
}
