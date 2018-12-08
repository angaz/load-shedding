import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import LoadShedding from './components/LoadShedding/LoadShedding';

class App extends Component {
  render() {
    return (
      <div className="App">
        <LoadShedding />
      </div>
    );
  }
}

export default App;
