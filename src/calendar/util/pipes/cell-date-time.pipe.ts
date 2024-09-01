import { Pipe, PipeTransform } from "@angular/core";
import { Interval, DateTime } from "luxon";

@Pipe({
    standalone: true,
    name: 'cellDateTime',
  })
  export class CellDateTimePipe implements PipeTransform {
    transform(day: Interval, time:DateTime, minutesToAdd?:number): DateTime {
      const timeWithMinutesAdded = time.plus({minutes: minutesToAdd ?? 0});
      const {hour, minute} = timeWithMinutesAdded;
      return day.start!.set({hour,minute});
    }
  }