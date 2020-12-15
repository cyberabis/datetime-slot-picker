import { Slot } from '../models/slot';
import { DateGrid, Week } from '../models/date-grid';

const monthIndex = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function generateDateGrid(slots: Slot[]): DateGrid[] {
  let dateGrids: DateGrid[] = [];
  //Validate formats and consistency
  //Get min and max date
  //Create grid for each month
  let isInputValid = true;
  let minDate: Date, maxDate: Date;
  for (let slot of slots) {
    if (slot.date && slot.date.substring(5) && slot.date.substring(5).split(' ').length === 3 &&
      monthIndex[slot.date.substring(5).split(' ')[1]] > -1 && parseInt(slot.date.substring(5).split(' ')[2])
      && parseInt(slot.date.substring(5).split(' ')[0])) {
      let parsedDate = new Date(
        parseInt(slot.date.substring(5).split(' ')[2]),
        monthIndex[slot.date.substring(5).split(' ')[1]],
        parseInt(slot.date.substring(5).split(' ')[0])
      );
      if (!minDate || minDate > parsedDate) minDate = parsedDate;
      if (!maxDate || maxDate < parsedDate) maxDate = parsedDate;
    } else {
      isInputValid = false;
      break;
    }
  }
  if (isInputValid && minDate && maxDate) {
    let { m1, y1 } = { m1: minDate.getMonth(), y1: minDate.getFullYear() };
    let { m2, y2 } = { m2: maxDate.getMonth(), y2: maxDate.getFullYear() };
    do {
      let dateGrid: DateGrid = {
        monthYear: months[m1] + ' ' + y1,
        weeks: []
      };
      //Lets create all days for m1, y1
      let allDays = [];
      let startDate = new Date(y1, m1, 1);
      let lastDate = new Date(y1, m1 + 1, 0);
      for (let frontPadCounter = 1; frontPadCounter <= startDate.getDay(); frontPadCounter++) {
        allDays.push(null);
      }
      for (let dayCounter = 1; dayCounter <= lastDate.getDate(); dayCounter++) {
        let currentDate = new Date(y1, m1, dayCounter);
        let dateText = days[currentDate.getDay()] + ', ' + dayCounter + ' ' + months[m1] + ' ' + y1;
        let slot = slots.find(s => s.date === dateText);
        allDays.push({
          dayOfMonth: dayCounter,
          isEnabled: slot ? true : false,
          dateText: dateText
        });
      }
      for (let backPadCounter = allDays.length + 1; backPadCounter <= 42; backPadCounter++) {
        allDays.push(null);
      }
      for (let weekCounter = 1; weekCounter <= 6; weekCounter++) {
        let week: Week = { days: [] };
        for (let weekdayCounter = 1; weekdayCounter <= 7; weekdayCounter++) {
          week.days.push(allDays.shift());
        }
        dateGrid.weeks.push(week);
      }
      dateGrids.push(dateGrid);
      if (m1 === 11) {
        m1 = 0;
        y1++;
      } else {
        m1++;
      }
    } while (y1 < y2 || (y1 === y2 && m1 <= m2))
  }
  return dateGrids;
}
