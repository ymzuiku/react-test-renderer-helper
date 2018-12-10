import React, { Component } from 'react';

class App extends Component {
  state = {
    num: 0,
  };
  handleAddNum = () => {
    this.setState(({ num }) => {
      return { num: num + 1 };
    });
  };
  render() {
    return (
      <div>
        <header>
          <h2>{this.state.num}</h2>
          <p id="test-click" onClick={this.handleAddNum}>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
