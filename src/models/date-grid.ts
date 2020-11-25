export interface DateGrid {
    monthYear: string, //Eg: Nov 2020
    weeks: Week[] //should be six weeks
}
export interface Week {
    days: Day[]
}
export interface Day {
    dayOfMonth: number,
    isEnabled: boolean,
    dateText: string //Eg: Wed, 25 Nov 2020 (standard format)
}