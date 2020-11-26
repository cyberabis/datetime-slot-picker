import { Component, Prop, h, State, Event, EventEmitter, Watch } from '@stencil/core';
import { translations } from '../../utils/translations';
import { Slot } from '../../models/slot';
import { DateGrid } from '../../models/date-grid';
import { TimeGrid } from '../../models/time-grid';
import { generateDateGrid } from '../../utils/generate-date-grid';
import { generateTimeGrid } from '../../utils/generate-time-grid';

@Component({
  tag: 'datetime-slot-picker',
  styleUrl: 'datetime-slot-picker.css'
})
export class DatetimeSlotPicker {

  @Prop() language: string;
  @Prop() placeholder: string;
  @Prop() slots: Slot[];
  
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

  @Event() onSlotUpdate: EventEmitter;

  neoInput!: HTMLInputElement;

  componentWillLoad() {
    this.processSlots(this.slots);
  }

  @Watch('slots')
  private processSlots(slots: Slot[]) {
    //Reset the state
    this.isTimeSlotGridVisible = false;
    this.selectedDate = undefined;
    this.selectedTime = undefined;
    this.displayText = undefined;
    this.dateGrids = generateDateGrid(slots);
    if(this.dateGrids && this.dateGrids.length) this.activeDateGridPage = 0;
  }

  private togglePopup() {
    if(this.neoInput.getBoundingClientRect().top < window.innerHeight/2) 
      this.isNeoInputAboveFold = true;
    else 
      this.isNeoInputAboveFold = false;
    if(this.neoInput.getBoundingClientRect().left < window.innerWidth/2) 
      this.isNeoInputLeftSide = true;
    else 
      this.isNeoInputLeftSide = false;
    this.neoInputHeight = this.neoInput.getBoundingClientRect().bottom - this.neoInput.getBoundingClientRect().top;
    this.isPopped = !this.isPopped;
    this.isTimeSlotGridVisible = false;
  }

  private setSelectedDate(dateText: string) {
    if(dateText) this.selectedDate = dateText;
    if(this.slots.length && this.slots[0].timeSlots){
      let slot = this.slots.find(s => s.date === this.selectedDate);
      this.timeGrids = generateTimeGrid(slot);
      this.isTimeSlotGridVisible = true;
    }
    else this.setSlot();
  }

  private setSlot() {
    this.displayText = this.selectedDate + (this.selectedTime ? (' ' + this.selectedTime) : '');
    this.onSlotUpdate.emit({date: this.selectedDate, timeSlot: this.selectedTime});
    this.isPopped = false;
    this.isTimeSlotGridVisible = false;
  }

  private closeGrid() {
    this.isPopped = false;
    this.isTimeSlotGridVisible = false;
  }

  private prevDateGrid() {
    if(this.activeDateGridPage > 0) this.activeDateGridPage--;
  }

  private nextDateGrid() {
    if(this.activeDateGridPage < this.dateGrids.length - 1) this.activeDateGridPage++;
  }
  
  private getTranslation(propertyName:string): string {
    return translations[this.language][propertyName];
  }

  render() {
    let popupStyle = {
      bottom: !this.isNeoInputAboveFold ? this.neoInputHeight + 'px' : undefined,
      left: this.isNeoInputLeftSide ? '0px' : undefined,
      right: !this.isNeoInputLeftSide ? '0px' : undefined
    };
    return <span class="neo-slot-picker">
      <input class="neo-input" type="text" readonly 
        placeholder={this.placeholder ? this.placeholder : 'Pick a time slot'} 
        value={this.displayText} 
        onClick={()=>this.togglePopup()}
        ref={(el) => this.neoInput = el as HTMLInputElement}
        >
      </input>
      { this.isPopped &&
        <div style={popupStyle} 
          class={this.isNeoInputAboveFold ? 'neo-popup neo-popup-below' : 'neo-popup neo-popup-above'}
          >
          {/* Table Grid when data exists */}
          { !this.isTimeSlotGridVisible && this.dateGrids && this.dateGrids.length &&
            <table class="neo-grid neo-date-grid">
              <tr>
                <th></th>
                <th>
                  {this.activeDateGridPage > 0
                    ? <span class="neo-paginate" onClick={()=>this.prevDateGrid()}>&lt;</span>
                    : <span>&nbsp;</span>
                  }
                </th>
                <th colSpan={3}>{this.dateGrids[this.activeDateGridPage].monthYear}</th>
                <th>
                  {this.activeDateGridPage < (this.dateGrids.length - 1)
                    ? <span class="neo-paginate" onClick={()=>this.nextDateGrid()}>&gt;</span>
                    : <span>&nbsp;</span>
                  }
                </th>
                <th><span class="neo-close" onClick={()=>this.closeGrid()}>&times;</span></th>
              </tr>
              <tr>
                <td><span class="neo-dow">S</span></td>
                <td><span class="neo-dow">M</span></td>
                <td><span class="neo-dow">T</span></td>
                <td><span class="neo-dow">W</span></td>
                <td><span class="neo-dow">T</span></td>
                <td><span class="neo-dow">F</span></td>
                <td><span class="neo-dow">S</span></td>
              </tr>
              {this.dateGrids[this.activeDateGridPage].weeks.map(week=>{
                return <tr>
                  {week.days.map(day=>{
                    return day
                      ? <td
                          class={!day.isEnabled ? 'neo-cell neo-cell-disabled' : (day.dateText == this.selectedDate ? 'neo-cell neo-cell-selected' : 'neo-cell neo-cell-enabled')} 
                          >
                          <span 
                            class={!day.isEnabled ? 'neo-day neo-day-disabled' : (day.dateText == this.selectedDate ? 'neo-day neo-day-selected' : 'neo-day neo-day-enabled')}
                            onClick={()=>this.setSelectedDate(day.isEnabled ? day.dateText : undefined)}
                            >
                            {day.dayOfMonth}
                          </span>
                        </td>
                      : <td>&nbsp;</td>
                  })}
                </tr>
              })}
            </table>
          }
          {/* TODO: Table Grid when no data */}
          {/* TODO: Time Grid when data exists */}

          {/* TODO: Time Grid when no data */}
        </div>
      }
    </span>
  }

}