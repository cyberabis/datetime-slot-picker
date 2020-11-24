import { Component, Prop, h, State, Event, EventEmitter, Element } from '@stencil/core';
import { translations } from '../../utils/translations';

@Component({
  tag: 'datetime-slot-picker',
  styleUrl: 'datetime-slot-picker.css'
})
export class DatetimeSlotPicker {

  @Prop() language: string;
  @Prop() placeholder: string;
  @Prop() slots: any[];
  
  @State() isPopped: boolean;
  @State() isNeoInputAboveFold: boolean;
  @State() isNeoInputLeftSide: boolean;
  @State() neoInputHeight: number;
  @State() selectedDate: string;
  @State() selectedTimeslot: string;
  @State() displayText: string;

  @Event() onSlotUpdate: EventEmitter;

  @Element() el: HTMLElement;

  private togglePopup() {
    let neoInput: HTMLElement = this.el.querySelector(".neo-input");
    if(neoInput.getBoundingClientRect().top < window.innerHeight/2) 
      this.isNeoInputAboveFold = true;
    else 
      this.isNeoInputAboveFold = false;
    if(neoInput.getBoundingClientRect().left < window.innerWidth/2) 
      this.isNeoInputLeftSide = true;
    else 
      this.isNeoInputLeftSide = false;
    this.neoInputHeight = neoInput.getBoundingClientRect().bottom - this.el.getBoundingClientRect().top;
    console.log('Is NeoInput Above Fold? ', this.isNeoInputAboveFold);
    console.log('Is NeoInput On Left Side? ', this.isNeoInputLeftSide);
    console.log('NeoInput Height: ', this.neoInputHeight);
    this.isPopped = !this.isPopped;
  }

  private setSlot() {
    //TODO

    this.onSlotUpdate.emit({date: this.selectedDate, timeslot: this.selectedTimeslot});
  }
  
  private getTranslation(propertyName:string): string {
    return translations[propertyName][this.language];
  }

  render() {
    return <span class="neo-slot-picker">
      <input class="neo-input" type="text" readonly 
        placeholder={this.placeholder ? this.placeholder : 'Pick a time slot'} 
        value={this.displayText} 
        onClick={()=>this.togglePopup()}
        >
      </input>
      { this.isPopped &&
        <div class={this.isNeoInputAboveFold ? "neo-popup neo-popup-below" : "neo-popup neo-popup-above"}>
          This is the popup section.
        </div>
      }
    </span>
  }

  componentDidRender() {
    let neoPopup: HTMLElement = this.el.querySelector(".neo-popup");
    if(neoPopup && this.isNeoInputLeftSide) neoPopup.style.setProperty('left', '0px');
    else if(neoPopup) neoPopup.style.setProperty('right', '0px');
    let neoPopupAbove: HTMLElement = this.el.querySelector(".neo-popup-above");
    if(neoPopupAbove) neoPopupAbove.style.setProperty('bottom', this.neoInputHeight + 'px');
  }
}
