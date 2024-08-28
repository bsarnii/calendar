import { OverlayRef } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
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
            <button mat-flat-button>Discard</button>
        </div>
        <input type="text" placeholder="Add a title">
        <input type="time">
        <input type=time>
    </form>
  `,
})
export class SaveEventOverlay {
   /* overlayRef = inject(OverlayRef);

    close(){
        this.overlayRef.detach();
        this.overlayRef.dispose();
    }*/
  
}