import React, { useState, useEffect } from 'react';
import './App.css';
import { GRID_WIDTH, GRID_HEIGHT } from './constants';

const App: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(Array(GRID_HEIGHT).fill(Array(GRID_WIDTH).fill(0)));
  const [blockPosition, setBlockPosition] = useState({ x: 4, y: 0 }); // 初期位置

  // ブロックの自動落下処理
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockPosition((prev) => {
        const newY = prev.y + 1;

        // 下端に到達した場合、または衝突した場合に停止
        if (newY >= GRID_HEIGHT || grid[newY][prev.x] !== 0) {
          // 次のブロックを生成
          return { x: 4, y: 0 };
        }

        return { ...prev, y: newY };
      });
    }, 1000); // 1秒ごとに落下

    return () => clearInterval(interval);
  }, [grid]);

  // グリッドの描画
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, colIndex) => {
          const isBlock = blockPosition.x === colIndex && blockPosition.y === rowIndex;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${isBlock ? 'block' : ''}`}
            ></div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>React Tetris</h1>
      <div
        className="grid"
        style={{
          display: 'inline-block',
          margin: '20px auto',
          border: '2px solid #000',
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};

export default App;
