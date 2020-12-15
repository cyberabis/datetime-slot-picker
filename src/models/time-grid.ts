export interface TimeGrid {
  dateText: string,
  rows: TimeRow[] //should be 6 rows
}
export interface TimeRow {
  times: Time[] //should be 2 or 4 time slots per row
}
export interface Time {
  timeText: string //Eg: 9 AM / 9:00 AM / 10 AM - 11 AM / 10:00 AM - 11:00 AM (standard formats)
}
