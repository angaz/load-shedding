import React, { Component } from 'react';

import DisplayDate from '../DisplayDate/DisplayDate';

import FindNextTimeSlot from './TimeSlots';
import Groups from './Groups';

import './LoadShedding.css'

const range = (start, end) => [...Array(end - start).keys()].map(i => i + start);


class LoadShedding extends Component {
  constructor() {
    super();

    this.state = {
      group: parseInt(localStorage.getItem('group')),
      stage: parseInt(localStorage.getItem('stage')),
      filterGroups: '',
    }
  }

  componentDidMount() {
    this.fetchStage();
  }

  fetchStage = () => {
    fetch('https://loadshedding.angusd.com/api/load_shedding_stage')
      .then(response => response.json())
      .then(stage => this.setStage(stage.stage));
  }

  setGroup = group => {
    localStorage.setItem('group', group);
    this.setState({
      group,
      filterGroups: '',
    });
  }

  setStage = stage => {
    localStorage.setItem('stage', stage);
    this.setState({ stage });
  }

  nextLoadShedding = overrideStage => {
    const { stage, group } = this.state;
    if ((overrideStage || stage) && group) {
      return FindNextTimeSlot(overrideStage || stage, group, new Date());
    }
  }

  filterGroupHandler = event => {
    const { value } = event.target;
    this.setState({
      filterGroups: value,
    });
  }

  render() {
    if (this.state.stage === null) {
      return (
        <div>
          <h2>Getting load shedding stage...</h2>
          <div>
            <h3>Alternatively, select a stage</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span onClick={this.fetchStage} style={{padding: '0.5em', margin: '0.25em 2em', border: '2px solid white', borderRadius: '0.25em'}}>Fetch Stage</span>
              <span onClick={() => this.setStage(0)} style={{padding: '0.5em', margin: '0.25em 2em', border: '2px solid white', borderRadius: '0.25em'}}>No Load Shedding</span>
              {[...Array(8).keys()].map(i => <span key={i} onClick={() => this.setStage(i+1)} style={{padding: '0.5em', margin: '0.25em 2em', border: '2px solid white', borderRadius: '0.25em'}}>{i+1}</span>)}
            </div>
          </div>
        </div>
      )
    }

    if (this.state.group === null) {
      return (
        <div>
          <h1>Please select a Group:</h1>
          <input type="text" placeholder="Filter Groups" onChange={this.filterGroupHandler} value={this.state.filterGroups} style={{width: '90%', fontSize: '1.5em', border: 'none', padding: '0.25em'}} />
          <table style={{borderSpacing: '0 0.5em', padding: '0 0.5em', width: '100%'}}>
            <thead>
              <tr>
                <th>Suburb and Extensions</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody>
              {
                Groups.filter(({ suburb, group }) => {
                  const { filterGroups } = this.state;
                  return filterGroups ? suburb.search(new RegExp(filterGroups.replace(' ', '.*?'), 'i')) !== -1 : true;
                }).map(({ suburb, group }) => (
                  <tr key={`${suburb}:${group}`} onClick={() => this.setGroup(group)}>
                    <td style={{textAlign: 'left', padding: '0.5em', border: '2px solid white', borderRight: 'none', borderRadius: '0.25em 0 0 0.25em'}}>{suburb}</td>
                    <td style={{padding: '0.5em', border: '2px solid white', borderLeft: 'none', borderRadius: '0 0.25em 0.25em 0'}}>{group}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )
    }

    const First4Stages = (
      <div style={{ marginTop: '2em' }}>
        {
          range(1, 5).map(stage => {
            const currentTimeSlot = this.nextLoadShedding(stage);

            return (
              <div key={stage} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5em 2.5em'}}>
                <div style={{marginRight: '1em'}}>
                  <span>Stage {stage}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <DisplayDate date={currentTimeSlot.date} />
                  <span>{currentTimeSlot.timeslot[0]} to {currentTimeSlot.timeslot[1]}</span>
                </div>
              </div>
            )
          })
        }
      </div>
    );

    const Buttons = (
      <div style={{position: 'absolute', bottom: 0, width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.2em'}}>
          <span style={{border: '2px solid white', borderRadius: '0.5em', padding: '1em'}} onClick={() => this.setGroup(null)}>Select Group</span>
          <span style={{border: '2px solid white', borderRadius: '0.5em', padding: '1em'}} onClick={() => this.setStage(null)}>Select Stage</span>
        </div>
      </div>
    );

    if (this.state.stage === 0) {
      return (
        <div>
          <div>
            <h1>Yay! No load shedding!</h1>
          </div>
          {First4Stages}
          {Buttons}
        </div>
      );
    }

    const nextTimeSlot = this.nextLoadShedding();

    return (
      <div>
        <h1>Stage {this.state.stage}</h1>
        <h2 style={{color: nextTimeSlot.current ? 'red' : 'inherit'}}>There is currently {nextTimeSlot.current ? '' : 'no'} load shedding</h2>

        <div style={{marginTop: '1em'}}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4>Next Load Shedding is scheduled for</h4>
            <DisplayDate date={nextTimeSlot.date} />
            <span>{nextTimeSlot.timeslot[0]} to {nextTimeSlot.timeslot[1]}</span>
          </div>
          {First4Stages}
          {Buttons}
        </div>
      </div>
    );
  }
}

export default LoadShedding;
