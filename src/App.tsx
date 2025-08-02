import React from 'react';
import './App.css';
import { GRID_WIDTH, GRID_HEIGHT } from './constants';

const App: React.FC = () => {
  // 10x20のグリッドを作成
  const createGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
      const cells = [];
      for (let col = 0; col < GRID_WIDTH; col++) {
        cells.push(
          <div
            key={`${row}-${col}`}
            className="cell"
            style={{
              width: '20px',
              height: '20px',
              border: '1px solid #ddd',
              backgroundColor: row === 0 && col === 4 ? 'blue' : 'white', // 初期ブロックを表示
            }}
          ></div>
        );
      }
      grid.push(
        <div key={row} className="row" style={{ display: 'flex' }}>
          {cells}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
