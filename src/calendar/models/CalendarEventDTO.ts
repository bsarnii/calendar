export interface CalendarEventInputDTO{
    start: string
    end: string
    title?: string
    description?: string
}

export interface CalendarEventOutputDTO{
    id: string
    start: string
    end: string
    title?: string
    description?: string 
}


/*
 GET request can be made for example to: /admin/employees/{employeeId}/calendar-events
*/

/*
 POST request can be made for example to: /admin/employees/{employeeId}/calendar-events
*/

/*
 PATCH/DELETE request can be made for example to: /admin/employees/{employeeId}/calendar-events/{calendarEventId}
*/

