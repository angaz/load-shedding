import React from 'react';

import './SelectStage.css';


export default ({ fetchStage, setStage }) => (
  <div className="SelectStage">
    <h2>Getting load shedding stage...</h2>
    <div>
      <h3>Alternatively, select a stage</h3>
      <div className="Selection">
        <button onClick={fetchStage}>Fetch Stage</button>
        <button onClick={() => setStage(0)}>No Load Shedding</button>
        {
          [...Array(8).keys()].map(i => (
            <button key={i} onClick={() => setStage(i+1)}>{i+1}</button>
          ))
        }
      </div>
    </div>
  </div>
)
