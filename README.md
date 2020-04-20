# react-angle-range

> a react angle range picker

[![NPM](https://img.shields.io/npm/v/react-angle-range.svg)](https://www.npmjs.com/package/react-angle-range) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Try it yourself
[DEMO](https://yotamberk.github.io/react-angle-range/)

## Install

via npm:

```bash
npm install --save react-angle-range
```

via yarn:

```bash
yarn add react-angle-range
```

## Usage

```jsx
import React, { Component } from 'react';
import AngleRange from 'react-angle-range';

class Example extends Component {
  render() {
    return (
      <AngleRange
        // for styling
        classes
       
        // required
        value = {{ from: 0, to: 90 }}
        onChange = {({ from = 0, to = 90 }) => {}}
        
        // optional
        isDisabled = {false}
        limitFrom = {null} // { min: <number>, max: <number> }
        limitTo = {null} // { min: <number>, max: <number> }
        radius = {150}
        handlerRangeRadiusOffset = {30}
        handlerRadius = {10}
        offsetHandlerRadius = {10}
        offsetHandlerRadiusOffset = {10}
        min = {0}
        max = {359}
        isQuarterCircle = {false}
      />
    )
  }
}
```

## Params



### Required

- #### value : { from: `number`[`degress`], to: `number`[`degress`] }
The value is the controlled range given by the parent components.
Notice that the numbers will be considered as degrees (and not as radiants) and are between 0 to 360.

- #### onChange : `funcion({ from, to })`
The function receives `{ from, to }` as its arument as calculated from the picker.


### Optional
- #### isDisabled : `boolean` (default: `false`)
Controls whether the controller is disabled or enabled. When the controller is disabled, handles are not draggable.

- #### limitFrom : { min: `number`[`degress`], max: `number`[`degress`] } (default: `null`)
Limit the `value.from` handler to a range of degrees between the `min` angle to the `max` angle.
Notice that if the `value.from` is not in the range between `min` and `max`, the handler will not usable.

- #### limitTo : { min: `number`[`degress`], max: `number`[`degress`] } (default: `null`)
Limit the `value.to` handler to a range of degrees between the `min` angle to the `max` angle.
Notice that if the `value.to` is not in the range between `min` and `max`, the handler will not usable.

- #### radius : `number`[`px`] (default: `150`)
Radius of the full range.

- #### handlerRangeRadiusOffset : `number`[`px`]  (default: `30`)
Distance of the angle handler from the full range.

- #### handlerRadius : `number`[`px`]  (default: `10`)
Radius of the angle handler.

- #### offsetHandlerRadius : `number`[`px`]  (default: `10`)
Distance of the offset handlers from the full range.

- #### offsetHandlerRadius : `number`[`px`]  (default: `10`)
Radius of the offset handlers.

- #### offsetHandlerRadiusOffset : `number`[`px`]  (default: `30`)
Distance of the offset handlers from the full range.

- #### min : `number`[`degress`]  (default: `0`)
Minimal value for the range (minimal `value.from`).

- #### max : `number`[`degress`]  (default: `359`)
Maximal value for the range (minimal `value.from`).

- #### isQuarterCircle : `boolean` (default: `false`)
Create a full range of only 0 until 90 degrees. 
The range will be the top-right range. 

### classes
All the styles of the internal components are configurable via the next names.
- root
- rootBoundaries
- fullRange
- relativeAxis
- axisCenter
- centerAngleHandler
- offsetAngleHandler
- offsetsSegment
- offsetsSegmentRemove

## License

MIT © [yotamberk](https://github.com/yotamberk)
