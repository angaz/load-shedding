import React from 'react';

import DisplayDate from '../DisplayDate/DisplayDate';

import './First4Stages.css';


const range = (start, end) => [...Array(end - start).keys()].map(i => i + start);


export default ({ nextLoadShedding }) => {
  const Rows = () => range(1, 5)
    .map(stage => [stage, nextLoadShedding(stage)])
    .map(([stage, timeslots]) => (
      <div key={stage} className="Row">
        <div className="StageNo">
          <span>Stage {stage}</span>
        </div>
        <div>
          {
            timeslots.map(timeslot => (
              <div key={`${stage}:${timeslot.timeslot[0]}`}>
                <DisplayDate date={timeslot.date} />
                <span> {timeslot.timeslot[0]} to {timeslot.timeslot[1]}</span>
              </div>
            ))
          }
        </div>
      </div>
    ));

  return (
    <div className="First4Stages">
      <Rows />
    </div>
  );
};
