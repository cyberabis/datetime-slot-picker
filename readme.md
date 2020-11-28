# Datetime Slot Picker

This is a Web Component for Date and Time Slot Picker. This project is a standalone Web Component using Stencil.

You have to pass in dates and time slots that you want to display.

When "timeSlots" is not passed, the component acts as a pure date picker.

This date and time slot picker is useful for below cases:
- If you have a set of dates that alone should be available for user input
- If you also want to display a custom time slot along with the date, eg: Sat, 28 Nov 2020, 10 AM - 11 AM.
- Useful for scheduling an appointment, choosing a delivery time, etc.
- Supports multi language translations. You can pass your own translations and display text.
- Supports displaying time slots in multiple formats: Eg: 4 PM, 4:00 PM, 16:00, 4 PM - 5 PM, 4:00 PM - 5:00 PM, 16:00 - 17:00.

# Usage and Live Demo

[View JS Bin](https://jsbin.com/yihufeg/edit?html,output)

## Using the component in HTML

The properties are optional, you can use them to pass custom text.

```
<datetime-slot-picker 
      placeholder="Pick a time slot" 
      time-slots-text="Time"
      no-slots-text="No slots are available"
      >
</datetime-slot-picker>
```

To display time slots in HH:mm format, pass the am-pm-disabled property

```
<datetime-slot-picker 
      placeholder="Pick a time slot" 
      time-slots-text="Time"
      no-slots-text="No slots are available" 
      am-pm-disabled
      >
</datetime-slot-picker>
```

If you are passing translations (using Javascript as shown in the later section), you can set the language code

```
<datetime-slot-picker 
      placeholder="Pick a time slot" 
      time-slots-text="Time"
      no-slots-text="No slots are available" 
      language="en"
      >
</datetime-slot-picker>
```

## Initializing slots & listening to slot changes in Javascript

Add the below code inside <script></script> in your HTML. Ensure the input date and time format is as stated below.

Supported input date format: 
- ddd, D MMM YYYY (Thu, 26 Nov 2020)

Supported input time formats: (Pick a format and all time slots should be the same format)
- H A (10 AM)
- H:mm A (10:00 AM)
- H A - H A (10 AM - 11 AM)
- H:mm A - H:mm A (10:00 AM - 11:00 AM)

```javascript
    const datetimeSlotPicker = document.querySelector('datetime-slot-picker');
    datetimeSlotPicker.addEventListener('slotUpdate', function(event){ console.log('Updated Slot: ', event.detail) });
    datetimeSlotPicker.slots = [
        {
            date: 'Thu, 26 Nov 2020',
            timeSlots: [
            '10:00 AM',
            '11:00 AM',
            '4:00 PM',
            '5:00 PM'
            ]
        },
        {
            date: 'Fri, 27 Nov 2020',
            timeSlots: [
            '10:00 AM',
            '11:00 AM',
            '4:00 PM',
            '5:00 PM'
            ]
        }
    ];
```

To pass translations, also set the translations property as shown below. You can have multiple langage codes like "en".

```javascript
    const datetimeSlotPicker = document.querySelector('datetime-slot-picker');
    datetimeSlotPicker.addEventListener('slotUpdate', function(event){ console.log('Updated Slot: ', event.detail) });
    datetimeSlotPicker.slots = [
        {
            date: 'Thu, 26 Nov 2020',
            timeSlots: [
            '10 AM - 11 AM',
            '11 AM - 12 PM',
            '4 PM - 5 PM',
            '5 PM - 6 PM'
            ]
        },
        {
            date: 'Fri, 27 Nov 2020',
            timeSlots: [
            '10 AM - 11 AM',
            '11 AM - 12 PM',
            '4 PM - 5 PM',
            '5 PM - 6 PM'
            ]
        }
    ];
    datetimeSlotPicker.translations = {
        en: {
            Mon: 'M',
            Tue: 'T',
            Wed: 'W',
            Thu: 'T',
            Fri: 'F',
            Sat: 'S',
            Sun: 'S',
            AM: 'AM',
            PM: 'PM',
            Jan: 'Jan',
            Feb: 'Feb',
            Mar: 'Mar',
            Apr: 'Apr',
            May: 'May',
            Jun: 'Jun',
            Jul: 'Jul',
            Aug: 'Aug',
            Sep: 'Sep',
            Oct: 'Oct',
            Nov: 'Nov',
            Dec: 'Dec'
        }
    };
```

## Using this component

There are three strategies we recommend for using web components built with Stencil.

### Script tag

- Put a script tag similar to this `<script src='https://unpkg.com/datetime-slot-picker@latest/dist/datetime-slot-picker/datetime-slot-picker.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install datetime-slot-picker --save`
- Put a script tag similar to this `<script src='node_modules/datetime-slot-picker/dist/datetime-slot-picker/datetime-slot-picker.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### In a stencil-starter app
- Run `npm install datetime-slot-picker --save`
- Add an import to the npm packages `import datetime-slot-picker;`
- Then you can use the element anywhere in your template, JSX, html etc

## Customizing Appearance

You can customize the styling by using CSS. All HTML elemets have a class name (usually starting with "neo", Eg: "neo-input") that can be used.

## Developers

To run the project locally, run:

```bash
gh repo clone cyberabis/datetime-slot-picker
cd datetime-slot-picker
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

The scripts will be generated under dist/datetime-slot-picker. 
The whole folder needs to be served, datetime-slot-picker.js acts as the entry point that's included in HTML.

## NPM Repository

https://www.npmjs.com/package/datetime-slot-picker

## Raising issues / getting help?

Please use the GitHub issue tracker - https://github.com/cyberabis/datetime-slot-picker/issues.