import { DateTime } from "luxon";

export function createHours() {
    const workingHours: DateTime[] = [];
    let next = DateTime.now().set({
      hour: 8,
      minute: 0,
      second: 0,
      millisecond: 0
    });
  
    while (next.hour <= 18) {
      workingHours.push(next);
      next = next.plus({ hour: 1 });
    }
    return workingHours;
  }