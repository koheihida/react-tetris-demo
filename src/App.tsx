import React, { useState, useEffect } from 'react';
import './App.css';
import { GRID_WIDTH, GRID_HEIGHT } from './constants';

const App: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0))
  );
  const [blockPosition, setBlockPosition] = useState({ x: 4, y: 0 }); // 初期位置

  // ライン消去処理
  const clearLines = (currentGrid: number[][]): number[][] => {
    const newGrid = currentGrid.filter((row) => row.some((cell) => cell === 0));
    const clearedLines = GRID_HEIGHT - newGrid.length;

    // 上に空の行を追加
    for (let i = 0; i < clearedLines; i++) {
      newGrid.unshift(Array(GRID_WIDTH).fill(0));
    }

    return newGrid;
  };

  // キーボード操作
  const handleKeyDown = (event: KeyboardEvent) => {
    setBlockPosition((prev) => {
      let newX = prev.x;

      if (event.key === 'ArrowLeft') {
        newX = Math.max(0, prev.x - 1); // 左端を超えない
      } else if (event.key === 'ArrowRight') {
        newX = Math.min(GRID_WIDTH - 1, prev.x + 1); // 右端を超えない
      }

      // 衝突判定
      if (grid[prev.y][newX] !== 0) {
        return prev; // 衝突がある場合は移動しない
      }

      return { ...prev, x: newX };
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid]);

  // ブロックの自動落下処理
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockPosition((prev) => {
        const newY = prev.y + 1;

        // 下端に到達した場合、または衝突した場合に停止
        if (newY >= GRID_HEIGHT || grid[newY][prev.x] !== 0) {
          // ブロックを固定
          const newGrid = [...grid];
          newGrid[prev.y][prev.x] = 1;

          // ライン消去処理を実行
          const updatedGrid = clearLines(newGrid);
          setGrid(updatedGrid);

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
              className={`cell ${isBlock || cell === 1 ? 'block' : ''}`}
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
