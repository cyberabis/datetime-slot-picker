# Usage and Live Demo

[View JS Bin](https://jsbin.com/yihufeg/edit?html,output)

## Using the component in HTML

```
<datetime-slot-picker 
      language="en" 
      placeholder="Pick a time slot" 
      time-slots-text="Time Slots"
      no-slots-text="No slots are available"
      >
</datetime-slot-picker>
```

## Initializing slots & listening to slot changes in Javascript

Add the below code inside <script></script> in your HTML.

```javascript
    const datetimeSlotPicker = document.querySelector('datetime-slot-picker');
    datetimeSlotPicker.addEventListener('slotUpdate', event => { console.log('Updated Slot: ', event.detail) });
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

# Datetime Slot Picker

This is a Web Component for Date and Time Slot Picker. This project is a standalone Web Component using Stencil.

## NPM Repository

https://www.npmjs.com/package/datetime-slot-picker

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

## Developers

To run the project locally, run:

```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

The scripts will be generated under dist/datetime-slot-picker. 
The whole folder needs to be served and datetime-slot-picker.js acts as the entry point that's included in HTML.