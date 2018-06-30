import React, { Component } from 'react';
import Board from './Board'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board boardId="@DEFAULT"/>
      </div>
    );
  }
}

export default App;
