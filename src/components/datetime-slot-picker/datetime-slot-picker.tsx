import { Component, Prop, h, State, Event, EventEmitter, Watch } from '@stencil/core';
import { builtInTranslations } from '../../utils/translations';
import { Slot } from '../../models/slot';
import { DateGrid } from '../../models/date-grid';
import { TimeGrid } from '../../models/time-grid';
import { Translations } from '../../models/translations';
import { generateDateGrid } from '../../utils/generate-date-grid';
import { generateTimeGrid } from '../../utils/generate-time-grid';

@Component({
  tag: 'datetime-slot-picker',
  styleUrl: 'datetime-slot-picker.css'
})
export class DatetimeSlotPicker {

  @Prop() placeholder: string = 'Pick a slot';
  @Prop() timeSlotsText: string = 'Time Slot';
  @Prop() noSlotsText: string = 'No slots are available';
  @Prop() slots: Slot[] = [];
  @Prop() language: string = 'en';
  @Prop() translations: Translations = builtInTranslations;
  @Prop() amPmDisabled: boolean = false;
  @Prop() datesHiddenWhenTimesShown: boolean = false;

  @State() isPopped: boolean;
  @State() isNeoInputAboveFold: boolean;
  @State() isNeoInputLeftSide: boolean;
  @State() neoInputHeight: number;
  @State() isTimeSlotGridVisible: boolean;
  @State() activeDateGridPage: number;
  @State() dateGrids: DateGrid[];
  @State() selectedDate: string; //Eg: Wed, 25 Nov 2020
  @State() activeTimeGridPage: number;
  @State() timeGrids: TimeGrid[];
  @State() selectedTime: string; //Eg: 10 AM, 10:00 AM, 10 AM - 11 AM, 10:00 AM - 11:00 AM
  @State() displayText: string;

  @Event() slotUpdate: EventEmitter;

  neoInput!: HTMLInputElement;

  componentWillLoad() {
    this.processSlots(this.slots);
  }

  @Watch('slots')
  private processSlots(slots: Slot[]) {
    if (this.slots) {
      //Reset the state
      this.isTimeSlotGridVisible = false;
      this.selectedDate = undefined;
      this.selectedTime = undefined;
      this.displayText = undefined;
      this.dateGrids = generateDateGrid(slots);
      if (this.dateGrids && this.dateGrids.length) this.activeDateGridPage = 0;
    }
  }

  private togglePopup() {
    if (this.slots) {
      if (this.neoInput.getBoundingClientRect().top < window.innerHeight / 2)
        this.isNeoInputAboveFold = true;
      else
        this.isNeoInputAboveFold = false;
      if (this.neoInput.getBoundingClientRect().left < window.innerWidth / 2)
        this.isNeoInputLeftSide = true;
      else
        this.isNeoInputLeftSide = false;
      this.neoInputHeight = this.neoInput.getBoundingClientRect().bottom - this.neoInput.getBoundingClientRect().top;
      this.isPopped = !this.isPopped;
      this.isTimeSlotGridVisible = false;
    }
  }

  private setSelectedDate(dateText: string) {
    if (dateText) {
      this.selectedDate = dateText;
      if (this.slots.length && this.slots[0].timeSlots) {
        //resetSlot until time is also chosen
        if (this.displayText) this.resetSlot();
        let slot = this.slots.find(s => s.date === this.selectedDate);
        this.timeGrids = generateTimeGrid(slot, this.datesHiddenWhenTimesShown);
        this.selectedTime = undefined;
        if (this.timeGrids && this.timeGrids.length) this.activeTimeGridPage = 0;
        this.isTimeSlotGridVisible = true;
      }
      else this.setSlot();
    }
  }

  private setSelectedTime(timeText: string) {
    if (timeText) {
      this.selectedTime = timeText;
      this.setSlot();
    }
  }

  private setSlot() {
    let translatedSelectedDate: string, translatedSelectedTime: string;
    let selectedDateParts = this.selectedDate.split(' ');
    translatedSelectedDate = this.getTranslation(selectedDateParts[0].substring(0, selectedDateParts[0].length - 1)) + ', ' +
      selectedDateParts[1] + ' ' + this.getTranslation(selectedDateParts[2]) + ' ' + selectedDateParts[3];
    if (this.selectedTime) {
      translatedSelectedTime = this.formatTimeSlot(this.selectedTime);
      translatedSelectedTime = translatedSelectedTime.replace(/AM/g, this.getTranslation('AM'));
      translatedSelectedTime = translatedSelectedTime.replace(/PM/g, this.getTranslation('PM'));
    }
    this.displayText = translatedSelectedDate + (this.selectedTime ? (', ' + translatedSelectedTime) : '');
    this.slotUpdate.emit({
      date: this.selectedDate,
      timeSlot: this.selectedTime,
      translatedDate: translatedSelectedDate,
      translatedTimeSlot: translatedSelectedTime
    });
    this.isPopped = false;
    this.isTimeSlotGridVisible = false;
  }

  private resetSlot() {
    this.displayText = undefined;
    this.slotUpdate.emit({
      date: null,
      timeSlot: null,
      translatedDate: null,
      translatedTimeSlot: null
    });
  }

  private closeGrid() {
    this.isPopped = false;
    this.isTimeSlotGridVisible = false;
    if (!this.displayText) {
      this.selectedDate = undefined;
      this.selectedTime = undefined;
    }
  }

  private goBack() {
    this.isTimeSlotGridVisible = false;
  }

  private prevDateGrid() {
    if (this.activeDateGridPage > 0) this.activeDateGridPage--;
  }

  private nextDateGrid() {
    if (this.activeDateGridPage < this.dateGrids.length - 1) this.activeDateGridPage++;
  }

  private prevTimeGrid() {
    if (this.activeTimeGridPage > 0) this.activeTimeGridPage--;
  }

  private nextTimeGrid() {
    if (this.activeTimeGridPage < this.timeGrids.length - 1) this.activeTimeGridPage++;
  }

  private getTranslation(propertyName: string): string {
    if (this.translations[this.language]) return this.translations[this.language][propertyName];
    else return builtInTranslations['en'][propertyName]; //use default
  }

  private formatTimeSlot(timeText: string): string {
    //Util function - starts
    let changeToHhmm = (timeTextPart: string): string => {
      let justTimePart = timeTextPart.replace(/ AM/g, '')
      justTimePart = justTimePart.replace(/ PM/g, '')
      if (timeTextPart.indexOf('AM') > -1) {
        let hourPart = justTimePart.split(':')[0].trim();
        if (hourPart.length === 1) hourPart = '0' + hourPart;
        if (hourPart.indexOf('12') === 0) hourPart = '00'
        return hourPart + ':' + (justTimePart.split(':')[1] ? justTimePart.split(':')[1].trim() : '00');
      } else if (timeTextPart.indexOf('PM') > -1) {
        let hourPart = justTimePart.split(':')[0].trim();
        if (hourPart.indexOf('12') !== 0) hourPart = (parseInt(hourPart) + 12).toString();
        return hourPart + ':' + (justTimePart.split(':')[1] ? justTimePart.split(':')[1].trim() : '00');
      }
    };
    //Util function - ends
    let formattedTimeText = timeText;
    if (this.amPmDisabled) {
      if (timeText.indexOf('-') > -1) {
        let timeTextParts: string[];
        timeTextParts = timeText.split('-');
        timeTextParts = timeTextParts.map(timeTextPart => changeToHhmm(timeTextPart));
        formattedTimeText = timeTextParts[0] + ' - ' + timeTextParts[1];
      } else {
        formattedTimeText = changeToHhmm(timeText);
      }
    }
    return formattedTimeText;
  }

  render() {
    let popupStyle = {
      bottom: !this.isNeoInputAboveFold ? this.neoInputHeight + 'px' : undefined,
      left: this.isNeoInputLeftSide ? '0px' : undefined,
      right: !this.isNeoInputLeftSide ? '0px' : undefined
    };
    let activeMonthYear: string[];
    if (this.dateGrids && this.dateGrids.length > 0)
      activeMonthYear = this.dateGrids[this.activeDateGridPage].monthYear.split(' ');
    return <span class="neo-slot-picker">
      <input class="neo-input" type="text" readonly
        placeholder={this.placeholder}
        value={this.displayText}
        onClick={() => this.togglePopup()}
        ref={(el) => this.neoInput = el as HTMLInputElement}
      >
      </input>
      {this.isPopped &&
        <div style={popupStyle}
          class={(this.isNeoInputAboveFold ? 'neo-popup neo-popup-below' : 'neo-popup neo-popup-above')}
        >
          {/* Date Grid when data exists */}
          {(!this.isTimeSlotGridVisible || !this.datesHiddenWhenTimesShown) && this.dateGrids && this.dateGrids.length > 0 &&
            <table class="neo-table neo-grid neo-date-grid">
              <tr class="neo-tr">
                <th class="neo-th neo-left-end"></th>
                <th colSpan={5} class="neo-th neo-center">
                  <span class={this.activeDateGridPage > 0 ? 'neo-paginate' : 'neo-paginate neo-paginate-disabled'} onClick={() => { if (this.activeDateGridPage > 0) this.prevDateGrid() }}>&lt;</span>
                  {this.getTranslation(activeMonthYear[0]) + ' ' + activeMonthYear[1]}
                  <span class={(this.activeDateGridPage < (this.dateGrids.length - 1)) ? 'neo-paginate' : 'neo-paginate neo-paginate-disabled'} onClick={() => { if (this.activeDateGridPage < (this.dateGrids.length - 1)) this.nextDateGrid() }}>&gt;</span>
                </th>
                <th class="neo-th neo-right-end"><span class="neo-close" onClick={() => this.closeGrid()}>&times;</span></th>
              </tr>
              <tr class="neo-tr neo-equal-width">
                <td class="neo-td">{this.getTranslation('Sun')}</td>
                <td class="neo-td">{this.getTranslation('Mon')}</td>
                <td class="neo-td">{this.getTranslation('Tue')}</td>
                <td class="neo-td">{this.getTranslation('Wed')}</td>
                <td class="neo-td">{this.getTranslation('Thu')}</td>
                <td class="neo-td">{this.getTranslation('Fri')}</td>
                <td class="neo-td">{this.getTranslation('Sat')}</td>
              </tr>
              {this.dateGrids[this.activeDateGridPage].weeks.map(week => {
                return <tr class="neo-tr neo-equal-width">
                  {week.days.map(day => {
                    return day
                      ? <td
                        class={!day.isEnabled ? 'neo-td neo-cell neo-cell-disabled' : (day.dateText == this.selectedDate ? 'neo-td neo-cell neo-cell-selected' : 'neo-td neo-cell neo-cell-enabled')}
                        onClick={() => this.setSelectedDate(day.isEnabled ? day.dateText : undefined)}
                      >
                        <span class={!day.isEnabled ? 'neo-day neo-day-disabled' : (day.dateText == this.selectedDate ? 'neo-day neo-day-selected' : 'neo-day neo-day-enabled')}>
                          {day.dayOfMonth}
                        </span>
                      </td>
                      : <td class='neo-td'>&nbsp;</td>
                  })}
                </tr>
              })}
            </table>
          }
          {(!this.isTimeSlotGridVisible || !this.datesHiddenWhenTimesShown) && this.dateGrids && !this.dateGrids.length &&
            <table class="neo-table neo-grid neo-empty-grid">
              <tr class="neo-tr">
                <th class="neo-th neo-left-end"></th>
                <th colSpan={5} class="neo-th neo-center">
                  &nbsp;
                </th>
                <th class="neo-th neo-right-end">
                  <span class="neo-close" onClick={() => this.closeGrid()}>&times;</span>
                </th>
              </tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td neo-no-slots-text">{this.noSlotsText}</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
            </table>
          }
          {(this.isTimeSlotGridVisible || (!this.datesHiddenWhenTimesShown && this.selectedDate)) && this.timeGrids && this.timeGrids.length > 0 &&
            <div>
              {
                this.datesHiddenWhenTimesShown &&
                <table class="neo-table neo-grid neo-time-grid">
                  <tr class="neo-tr">
                    <th class="neo-th neo-left-end">
                      <span class="neo-back" onClick={() => this.goBack()}>&larr;</span>
                    </th>
                    <th class="neo-th neo-center" colSpan={6}>
                      {this.timeSlotsText}
                    </th>
                    <th class="neo-th neo-right-end">
                      <span class="neo-close" onClick={() => this.closeGrid()}>&times;</span>
                    </th>
                  </tr>
                </table>
              }
              <div class={(this.datesHiddenWhenTimesShown && this.isTimeSlotGridVisible ? ' neo-scroll' : '')}>
                <table class="neo-table neo-grid neo-time-grid">
                  {
                    this.timeGrids[this.activeTimeGridPage].rows.map(row => {
                      return <tr class="neo-tr neo-equal-width">
                        {row.times.map(time => {
                          let translatedTimeText;
                          if (time) {
                            translatedTimeText = this.formatTimeSlot(time.timeText);
                            translatedTimeText = translatedTimeText.replace(/AM/g, this.getTranslation('AM'));
                            translatedTimeText = translatedTimeText.replace(/PM/g, this.getTranslation('PM'));
                          }
                          return time
                            ? <td
                              colSpan={row.times.length === 2 ? 4 : 2}
                              class={time.timeText == this.selectedTime ? 'neo-td neo-cell neo-cell-selected' : 'neo-td neo-cell neo-cell-enabled'}
                              onClick={() => this.setSelectedTime(time.timeText)}
                            >
                              <span class={time.timeText == this.selectedTime ? 'neo-time neo-time-selected' : 'neo-time neo-time-enabled'}>
                                {translatedTimeText}
                              </span>
                            </td>
                            : <td colSpan={row.times.length === 2 ? 4 : 2} class="neo-td">&nbsp;</td>
                        })}
                      </tr>
                    })}
                </table>
              </div>
              {
                !this.datesHiddenWhenTimesShown && this.timeGrids && this.timeGrids.length > 0 &&
                <table class="neo-table neo-grid neo-time-grid">
                  <tr class="neo-tr">
                    <th class="neo-th neo-left-end">
                      <span>&nbsp;</span>
                    </th>
                    <th class="neo-th neo-center" colSpan={6}>
                      <span class={this.activeTimeGridPage > 0 ? 'neo-paginate' : 'neo-paginate neo-paginate-disabled'} onClick={() => { if (this.activeTimeGridPage > 0) this.prevTimeGrid() }}>&lt;</span>
                      {this.timeSlotsText}
                      <span class={(this.activeTimeGridPage < (this.timeGrids.length - 1)) ? 'neo-paginate' : 'neo-paginate neo-paginate-disabled'} onClick={() => { if (this.activeTimeGridPage < (this.timeGrids.length - 1)) this.nextTimeGrid() }}>&gt;</span>
                    </th>
                    <th class="neo-th neo-right-end">
                      <span>&nbsp;</span>
                    </th>
                  </tr>
                </table>
              }
            </div>
          }
          {(this.isTimeSlotGridVisible || (!this.datesHiddenWhenTimesShown && this.selectedDate)) && this.timeGrids && !this.timeGrids.length &&
            <table class="neo-table neo-grid neo-empty-grid">
              <tr class="neo-tr">
                <th class="neo-th neo-left-end">
                  {this.datesHiddenWhenTimesShown
                    ? <span class="neo-back" onClick={() => this.goBack()}>&larr;</span>
                    : <span>&nbsp;</span>
                  }
                </th>
                <th colSpan={5} class="neo-th neo-center">
                  &nbsp;
                </th>
                <th class="neo-th neo-right-end">
                  {this.datesHiddenWhenTimesShown
                    ? <span class="neo-close" onClick={() => this.closeGrid()}>&times;</span>
                    : <span>&nbsp;</span>
                  }
                </th>
              </tr>
              {this.datesHiddenWhenTimesShown &&
                <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              }
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td neo-no-slots-text">{this.noSlotsText}</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              {this.datesHiddenWhenTimesShown &&
                <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              }
              {this.datesHiddenWhenTimesShown &&
                <tr class="neo-tr"><td colSpan={7} class="neo-td">&nbsp;</td></tr>
              }
            </table>
          }
        </div>
      }
    </span>
  }

}
