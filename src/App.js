import React, { Component } from 'react';

import Autocomplete from "./Components/Autocomplete";
import './App.scss';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Autocomplete />
      </div>
    );
  }
}

export default App;
