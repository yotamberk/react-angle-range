# react-angle-range

> a react angle range picker

[![NPM](https://img.shields.io/npm/v/react-angle-range.svg)](https://www.npmjs.com/package/react-angle-range) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
        classes,
       
        // required
        value = { from: 0, to: 90 },
        onChange = ({ from = 0, to = 90 }) => {},
        
        // optional
        isDisabled = false,
        limitFrom = { min: 0, max: 90 },
        limitTo = { min: 0, max: 90 },
        radius = RADIUS,
        handlerRangeRadiusOffset = 51,
        handlerRadius = 10,
        offsetHandlerRadius = 10,
        offsetHandlerRadiusOffset = 10,
        min = 0,
        max = 359,
        isQuarterCircle = false
      />
    )
  }
}
```

## License

MIT © [yotamberk](https://github.com/yotamberk)
