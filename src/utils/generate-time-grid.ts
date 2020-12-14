import { Slot } from '../models/slot';
import { TimeGrid, TimeRow } from '../models/time-grid';

export function generateTimeGrid(slot: Slot, datesHiddenWhenTimesShown: boolean): TimeGrid[] {
    let timeGrids: TimeGrid[] = [];
    let times = slot.timeSlots.filter(ts=>{
        let isValid = true;
        if(!ts) isValid = false;
        //TODO Check if time format is like 9 AM / 9:00 AM / 10 AM - 11 AM / 10:00 AM - 11:00 AM

        return isValid;
    });
    //Determine number of columns
    //Determine number of grids
    if(times.length) {
        let noOfRows = datesHiddenWhenTimesShown ? 7 : 4;
        let noOfColumns = times[0].length <= 8 ? 4 : 2;
        let noOfCells = noOfColumns * noOfRows;
        let noOfGrids = Math.ceil(times.length/noOfCells);
        if (datesHiddenWhenTimesShown && noOfGrids > 1) {
          noOfRows = noOfGrids * noOfRows;
          noOfGrids = 1;
        }
        for(let gridCounter = 1; gridCounter <= noOfGrids; gridCounter++) {
            let timeGrid:TimeGrid = {
                dateText: slot.date.substring(5),
                rows: []
            };
            for(let rowCounter = 1; rowCounter <= noOfRows; rowCounter++) {
                let row:TimeRow = {times: []};
                for(let columnCounter = 1; columnCounter <= noOfColumns; columnCounter++) {
                    let time = times.shift();
                    row.times.push(time ? {timeText: time} : null);
                }
                timeGrid.rows.push(row);
            }
            timeGrids.push(timeGrid);
        }
    }
    return timeGrids;
}
