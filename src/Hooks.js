import React from 'react';
import tester from './lib/tester.lib';

function Hooks() {
  const [num, setNum] = React.useState(0);
  function render() {
    function handleAddNum() {
      setNum(num + 1);
    }
    tester.setStatus({ num });
    return (
      <div>
        <header>
          <h2>{num}</h2>
          <p id="test-click" onClick={handleAddNum}>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    );
  }
  return React.useMemo(render, [num]);
}

export default Hooks;
