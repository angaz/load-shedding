import React, { Component } from 'react';

import DisplayDate from '../DisplayDate/DisplayDate';

import FindNextTimeSlot from './TimeSlots';
import Groups from './Groups';

import './LoadShedding.css'


class LoadShedding extends Component {
  constructor() {
    super();

    this.state = {
      group: parseInt(localStorage.getItem('group')) || null,
      stage: null,
    }
  }

  componentDidMount() {
    fetch('https://loadshedding.angusd.com/api/load_shedding_stage')
      .then(response => response.json())
      .then(stage => this.setState({ stage: stage.stage }))
  }

  setGroup = group => {
    localStorage.setItem('group', group);
    this.setState({ group });
  }

  setStage = stage => {
    this.setState({ stage });
  }

  nextLoadShedding = () => {
    const { stage, group } = this.state;
    if (stage && group) {
      return FindNextTimeSlot(stage, group, new Date());
    }
  }

  render() {
    if (this.state.stage === null) {
      return (
        <div>
          <h1>Getting load shedding stage...</h1>
          <div>
            <h2>If the stage doesn't load soon, please select a stage</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[...Array(7).keys()].map(i => <span key={i} onClick={() => this.setStage(i+1)}>{i+1}</span>)}
            </div>
          </div>
        </div>
      )
    }

    if (this.state.group === null) {
      return (
        <div>
          <h1>Please select a Group:</h1>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
              Groups.map(({ suburb, group }) => (
                <div key={`${suburb}:${group}`} onClick={() => this.setGroup(group)}>
                  <span>{suburb}</span>
                  <span>{group}</span>
                </div>
              ))
            }
          </div>
        </div>
      )
    }

    if (this.state.stage === 0) {
      return (
        <div>
          <h1>Yay! No load shedding... for now.</h1>
        </div>
      );
    }

    const nextTimeSlot = this.nextLoadShedding();

    return (
      <div>
        <h1>Stage {this.state.stage}</h1>
        <h2>There is currently {nextTimeSlot.current ? '' : 'no'} load shedding</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Next Load Shedding is scheduled for</span>
          <DisplayDate date={nextTimeSlot.date} />
          <span>{nextTimeSlot.timeslot[0]} to {nextTimeSlot.timeslot[1]}</span>
        </div>
      </div>
    );
  }
}

export default LoadShedding;
