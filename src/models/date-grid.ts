export interface DateGrid {
    monthYear: string,
    weeks: Week[]
}
export interface Week {
    days: Day[]
}
export interface Day {
    dayOfMonth: number,
    isEnabled: boolean,
    isSelected?: boolean
}