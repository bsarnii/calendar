import { OverlayRef } from '@angular/cdk/overlay';
import { Component, computed, inject, input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'kj-save-event-overlay',
  imports: [MatButtonModule],
  template: `
    <div class="overlay-header"></div>
    <form>
        <div class="button-container">
            <button mat-flat-button>Save</button>
            <button mat-button>Discard</button>
        </div>
        <div class="input-wrapper">
          <input type="text" placeholder="Add a title">
          <input type="time" [value]="initialStartValue()">
          <input type=time [value]="initialEndValue()">
        </div>
    </form>
  `,
})
export class SaveEventOverlay {
  start = input(0);

  initialStartValue = computed(() => {
    return `${this.start().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}:00` 
  });

  initialEndValue = computed(() => {
    return `${this.start().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}:30` 
  })
  
}