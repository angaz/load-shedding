import React, { useState, useEffect } from 'react';

import FindNextTimeSlots from './TshwaneTimeSlots';
import DisplayDate from '../DisplayDate/DisplayDate';
import First4Stages from './First4Stages';
import SelectGroup from './SelectGroup';
import SelectStage from './SelectStage';

import './LoadShedding.css'


export default () => {
  const [ group, setGroupState ] = useState(parseInt(localStorage.getItem('group')) || null);
  const [ stage, setStageState ] = useState(parseInt(localStorage.getItem('stage')) || null);
  const [ selectGroup, setSelectGroup ] = useState(Boolean(group));
  const [ selectStage, setSelectStage ] = useState(Boolean(stage || stage !== 0));

  useEffect(() => {
    fetchStage();
  }, []);

  const fetchStage = async () => {
    const resp = await fetch('https://loadshedding.angusd.com/api/load_shedding_stage');

    if (resp.ok) {
      setStage((await resp.json()).stage);
    }

    return resp.ok;
  }

  const setGroup = group => {
    localStorage.setItem('group', group);
    setGroupState(group);
    setSelectGroup(false);
  }

  const setStage = stage => {
    localStorage.setItem('stage', stage);
    setStageState(stage);
    setSelectStage(false);
  }

  const nextLoadShedding = overrideStage => {
    if ((overrideStage || stage) && group) {
      const timeslots = FindNextTimeSlots(overrideStage || stage, group, new Date());
      return timeslots;
    }
  }

  const FooterButtons = () => (
    <div className="FooterButtons">
      <div className="Container">
        <button onClick={() => setSelectGroup(true)}>Select Group</button>
        <button onClick={() => setSelectStage(true)}>Select Stage</button>
      </div>
    </div>
  );

  if (selectGroup || group === null) {
    return <SelectGroup setGroup={setGroup} />
  }

  if (selectStage || stage === null) {
    return <SelectStage fetchStage={fetchStage} setStage={setStage} />
  }

  if (stage === 0) {
    return (
      <div>
        <div>
          <h1>Yay! No load shedding!</h1>
        </div>

        <First4Stages nextLoadShedding={nextLoadShedding} />
        <FooterButtons />
      </div>
    );
  }

  const nextTimeSlots = nextLoadShedding();

  return (
    <div style={{ minHeight: '100%' }}>
      <h1>Stage {stage}</h1>
      <h2 style={{color: nextTimeSlots[0].current ? 'red' : 'inherit'}}>
        There is currently {nextTimeSlots[0].current ? '' : 'no'} load shedding
      </h2>

      <div style={{display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4>Next Load Shedding is scheduled for</h4>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <DisplayDate date={nextTimeSlots[0].date} />
              <span>{nextTimeSlots[0].timeslot.start} - {nextTimeSlots[0].timeslot.end}</span>
            </div>

            <span><strong>then</strong></span>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <DisplayDate date={nextTimeSlots[1].date} />
              <span>{nextTimeSlots[1].timeslot.start} - {nextTimeSlots[1].timeslot.end}</span>
            </div>
          </div>
        </div>

        <First4Stages nextLoadShedding={nextLoadShedding} />
        <FooterButtons />
      </div>
    </div>
  );
};
