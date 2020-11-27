# Usage and Live Demo

<a href="https://jsbin.com/yihufeg/edit?html,output" target="_blank">View JS Bin</a>

# Datetime Slot Picker

This is a Web Component for Date and Time Slot Picker. This project is a standalone Web Component using Stencil.

# Stencil

Stencil is a compiler for building fast web apps using Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool.  Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all.

## Getting Started

To run the project locally, run:

```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

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