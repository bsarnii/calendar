import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'toDay',
  standalone: true,
  pure: true,
})
export class ToDayPipe implements PipeTransform {
  transform(date: DateTime) {
    return date.toFormat('ccc');
  }
}
