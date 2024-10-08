import { Pipe, PipeTransform } from "@angular/core";
import { DateTime } from "luxon";

@Pipe({
  name: 'isToday',
  standalone: true,
  pure: true,
})
export class IsTodayPipe implements PipeTransform {
  transform(date: DateTime) {
    return date.hasSame(DateTime.local(), 'day');
  }
}