import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';
import { translations } from '../../utils/translations';
import { Slot } from '../../models/slot';
import { DateGrid } from '../../models/date-grid';

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
  @State() dateGrid: DateGrid[];
  @State() selectedDate: string;
  @State() selectedTimeSlot: string;
  @State() displayText: string;

  @Event() onSlotUpdate: EventEmitter;

  neoInput!: HTMLInputElement;

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
  }

  private getActiveMonthYear():string {
    //TODO
    return 'Dec 2020';
  }

  private closeGrid() {
    this.isPopped = false;
  }

  private prevDateGrid() {
    //TODO
  }

  private nextDateGrid() {
    //TODO
  }

  private setSlot() {
    //TODO
    this.onSlotUpdate.emit({date: this.selectedDate, timeSlot: this.selectedTimeSlot});
  }
  
  private getTranslation(propertyName:string): string {
    return translations[propertyName][this.language];
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
          { !this.isTimeSlotGridVisible && 
            <table class="neo-grid neo-date-grid">
              <tr>
                <th></th>
                <th><span class="neo-paginate" onClick={()=>this.prevDateGrid()}>&lt;</span></th>
                <th colSpan={3}>{this.getActiveMonthYear()}</th>
                <th><span class="neo-paginate" onClick={()=>this.nextDateGrid()}>&gt;</span></th>
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

            </table>
          }
        </div>
      }
    </span>
  }

}
