import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, computed, effect, inject, Input, input, output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { DateTime } from 'luxon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CalendarEventInputDTO } from './models/CalendarEventDTO';

@Component({
  standalone: true,
  selector: 'kj-save-event-overlay',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <div class="overlay-header"></div>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="button-container">
            <button type="submit" mat-flat-button>Save</button>
            <button (click)="close.emit()" type="button" mat-button>Discard</button>
        </div>
        <div class="input-wrapper">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input [formControl]="form.controls.title" matInput type="text" placeholder="Add a title">
          </mat-form-field>
          <div class="time-input-wrapper">
            <mat-form-field appearance="outline">
            <mat-label>Start</mat-label>
              <input [formControl]="form.controls.start" matInput type="time">
            </mat-form-field>
            <mat-form-field appearance="outline">
            <mat-label>End</mat-label>
              <input [formControl]="form.controls.end" matInput type="time">
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea [formControl]="form.controls.description" matInput placeholder="Add a description"></textarea>
          </mat-form-field>
        </div>
    </form>
  `,
})
export class SaveEventOverlay {
  fb = inject(NonNullableFormBuilder);

  initialEventDate = DateTime.now();

  @Input() set setDate(value:DateTime){
    this.form.controls.start.patchValue(value.toFormat('HH:mm'));
    this.form.controls.end.patchValue(value.plus({minutes: 30}).toFormat('HH:mm'))
    this.initialEventDate = value;
    console.log(value)
  }
  close = output();
  saveEvent = output<CalendarEventInputDTO>();


  form = this.fb.group({
    start: '00:00',
    end: '00:00',
    title: '',
    description: ''
  })

  onSubmit(){
    const start = DateTime.fromFormat(this.form.getRawValue().start, 'hh:mm').toObject();
    const end = DateTime.fromFormat(this.form.getRawValue().end, 'hh:mm').toObject();
    const result:CalendarEventInputDTO = {
      ...this.form.getRawValue(),
      start: this.initialEventDate.set({minute: start.minute, hour: start.hour }).toISO()!,
      end: this.initialEventDate.set({minute: end.minute, hour: end.hour}).toISO()!
    }
    this.saveEvent.emit(result);
    this.close.emit()
  }

  ngOnDestroy(){
    this.close.emit()
  }


  
}