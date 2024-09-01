import { OverlayModule, Overlay } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { Component, Input, output, inject } from "@angular/core";
import { DateTime } from "luxon";
import { CalendarEventInputDTO } from "../../../models/CalendarEventDTO";
import { SaveEventOverlayComponent } from "../save-event-overlay/save-event-overlay.component";

@Component({
    standalone: true,
    selector: 'kj-calendar-clickable-cell',
    imports: [SaveEventOverlayComponent, OverlayModule, CommonModule],
    template: `
      <div 
        [class.opened]="isOverlayOpen"
        cdkOverlayOrigin 
        #trigger="cdkOverlayOrigin" 
        (click)="isOverlayOpen = !isOverlayOpen" 
        [style]="{height: '100%', width: '100%'}"
      ></div>
  
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="isOverlayOpen"
        (overlayOutsideClick)="isOverlayOpen = false"
        [cdkConnectedOverlayPositions]="[
          {
              originX: 'end',
              originY: 'center',
              overlayX: 'start',
              overlayY: 'center',
              offsetX: 10
          },
          {
              originX: 'start',
              originY: 'center',
              overlayX: 'end',
              overlayY: 'center',
              offsetX: -10
          }
        ]"
        [cdkConnectedOverlayViewportMargin]="5"
        [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
        cdkConnectedOverlayPush="true"
      >
        <kj-save-event-overlay (saveEvent)="saveEvent.emit($event)" (close)="isOverlayOpen = false" [setDate]="date"/>
        </ng-template>
  
    `,
  })
  export class ClickableCellComponent {
    
    @Input({required:true}) date!: DateTime;
    saveEvent = output<CalendarEventInputDTO>();
    overlay = inject(Overlay);
  
  
    isOverlayOpen = false;
    scrollStrategy = this.overlay.scrollStrategies.close();
  
  }