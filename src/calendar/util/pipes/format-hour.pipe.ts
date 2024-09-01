import { Pipe, PipeTransform } from "@angular/core";
import { DateTime } from "luxon";

@Pipe({
    standalone: true,
    name: 'formatHour',
  })
  export class FormatHourPipe implements PipeTransform {
    transform(date: DateTime): string {
      return date.toFormat('h a');
    }
  }