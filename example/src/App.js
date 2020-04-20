import _set from 'lodash/set';
import React, { useState, useCallback } from "react";

import { AngleRange } from 'react-angle-range'
import 'react-angle-range/dist/index.css'

import './App.css';

const defaultDemand = {
  name: 'Prisma demand',
  productParams: {
    controlledInputs: {
      elevationAngle: {
        from: 0,
        to: 90,
      },
      azimuthAngle: {
        from: 0,
        to: 180,
      }
    },
  },
}

const modulus360 = (angle) => (
  (angle + 360) % 360
)

function App() {
  const [ demand, setDemand ] = useState(defaultDemand)

  const onChange = useCallback((prop, value) => {
    let updatedDemand = { ...demand }
    _set(updatedDemand, prop, value)
    // updatedDemand[prop] = value
    setDemand(updatedDemand)
  }, [ demand, setDemand ])
  
  const onChangeAzimuthAngle = useCallback(({ from, to }) => {
    onChange('productParams.controlledInputs.azimuthAngle', { from, to })
  }, [ onChange ])
  
  return (
    <div className="App">
      <header className="App-header">
       Prisma components
      </header>

      <div className="demand-card-components">
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>
            <h3>Azimuth Angle</h3>
            <AngleRange
              radius={150}
              value={demand.productParams.controlledInputs.azimuthAngle}
              onChange={onChangeAzimuthAngle}
              handlerRadius={10}
              handlerRangeRadiusOffset={51}
              min={1}
              max={360}
              minOffset={0}
              maxOffset={180}
            />
            <div className='dashboard'>
            <div>
              <div>center angle: {(modulus360(demand.productParams.controlledInputs.azimuthAngle.to + demand.productParams.controlledInputs.azimuthAngle.from) / 2)}°</div> 
              <div>offset angle: ±{modulus360((demand.productParams.controlledInputs.azimuthAngle.to - demand.productParams.controlledInputs.azimuthAngle.from) )/ 2}°</div>
              <div>from: {demand.productParams.controlledInputs.azimuthAngle.from}°</div>
              <div>to: {demand.productParams.controlledInputs.azimuthAngle.to}°</div> 
            </div>
          </div>
          </div>
          
          <div>
            <h3>Demand: </h3>
            {demand}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

