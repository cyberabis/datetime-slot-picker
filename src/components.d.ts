/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Slot } from "./models/slot";
import { Translations } from "./models/translations";
export namespace Components {
    interface DatetimeSlotPicker {
        "dateFormat": string;
        "datesHiddenWhenTimesShown": boolean;
        "language": string;
        "noSlotsText": string;
        "placeholder": string;
        "slots": Slot[];
        "timeFormat": string;
        "timeSlotsText": string;
        "translations": Translations;
    }
}
declare global {
    interface HTMLDatetimeSlotPickerElement extends Components.DatetimeSlotPicker, HTMLStencilElement {
    }
    var HTMLDatetimeSlotPickerElement: {
        prototype: HTMLDatetimeSlotPickerElement;
        new (): HTMLDatetimeSlotPickerElement;
    };
    interface HTMLElementTagNameMap {
        "datetime-slot-picker": HTMLDatetimeSlotPickerElement;
    }
}
declare namespace LocalJSX {
    interface DatetimeSlotPicker {
        "dateFormat"?: string;
        "datesHiddenWhenTimesShown"?: boolean;
        "language"?: string;
        "noSlotsText"?: string;
        "onSlotUpdate"?: (event: CustomEvent<any>) => void;
        "placeholder"?: string;
        "slots"?: Slot[];
        "timeFormat"?: string;
        "timeSlotsText"?: string;
        "translations"?: Translations;
    }
    interface IntrinsicElements {
        "datetime-slot-picker": DatetimeSlotPicker;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "datetime-slot-picker": LocalJSX.DatetimeSlotPicker & JSXBase.HTMLAttributes<HTMLDatetimeSlotPickerElement>;
        }
    }
}
