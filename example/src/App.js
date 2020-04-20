import _set from 'lodash/set';
import React, { useState, useCallback } from "react";

import { AngleRange } from 'react-angle-range';
import 'react-angle-range/dist/index.css';

import './App.css';

const defaultAngleRange = {
  example1: {
    from: 0,
    to: 180,
  },
}

const modulus360 = (angle) => (
  (angle + 360) % 360
)

function App() {
  const [ angleRange, setAngleRange ] = useState(defaultAngleRange)

  const onChange = useCallback((prop, value) => {
    let updatedAngleRange = { ...angleRange }
    _set(updatedAngleRange, prop, value)
    setAngleRange(updatedAngleRange)
  }, [ angleRange, setAngleRange ])
  
  const onChangeAngleRangeExample1 = useCallback(({ from, to }) => {
    onChange('example1', { from, to })
  }, [ onChange ])
  
  return (
    <div className="App">
      <header className="App-header">
       Examples react-angle-range
      </header>

      <div className="AngleRange-card-components">
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>
            <h3>Full range angleRange</h3>
            <AngleRange
              radius={150}
              value={AngleRange.example1}
              onChange={onChangeAngleRangeExample1}
              handlerRadius={10}
              handlerRangeRadiusOffset={51}
              min={1}
              max={360}
              minOffset={0}
              maxOffset={180}
            />
            <div className='dashboard'>
            <div>
              <div>center angle: {(modulus360(angleRange.example1.to + angleRange.example1.from) / 2)}°</div> 
              <div>offset angle: ±{modulus360((angleRange.example1.to - angleRange.example1.from) )/ 2}°</div>
              <div>from: {angleRange.example1.from}°</div>
              <div>to: {angleRange.example1.to}°</div> 
            </div>
          </div>
          </div>
          
          <div>
            <h3>angleRange: </h3>
            {JSON.stringify(angleRange)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

