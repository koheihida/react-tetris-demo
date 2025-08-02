import React, { useState, useEffect } from 'react';
import './App.css';
import { GRID_WIDTH, GRID_HEIGHT, TETROMINOES } from './constants';

const App: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0))
  );
  const [currentTetromino, setCurrentTetromino] = useState(TETROMINOES.T); // 初期形状
  const [blockPosition, setBlockPosition] = useState({ x: 4, y: 0 }); // 初期位置

  // ブロックの回転
  const rotateTetromino = (tetromino: number[][]): number[][] => {
    return tetromino[0].map((_, colIndex) =>
      tetromino.map((row) => row[colIndex]).reverse()
    );
  };

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
    console.log('Key pressed:', event.key); // デバッグ用
    setBlockPosition((prev) => {
      let newX = prev.x;
      let newY = prev.y;
      let newTetromino = currentTetromino;

      if (event.key === 'ArrowLeft') {
        newX = Math.max(0, prev.x - 1); // 左端を超えない
      } else if (event.key === 'ArrowRight') {
        newX = Math.min(GRID_WIDTH - currentTetromino[0].length, prev.x + 1); // 右端を超えない
      } else if (event.key === 'ArrowDown') {
        newY = Math.min(GRID_HEIGHT - currentTetromino.length, prev.y + 1); // 下に高速移動
      } else if (event.key === 'ArrowUp') {
        newTetromino = rotateTetromino(currentTetromino); // 回転
      }

      // 衝突判定
      if (
        newTetromino.some((row, rowIndex) =>
          row.some(
            (cell, colIndex) =>
              cell &&
              (grid[newY + rowIndex]?.[newX + colIndex] !== 0 ||
                newY + rowIndex >= GRID_HEIGHT)
          )
        )
      ) {
        return prev; // 衝突がある場合は移動しない
      }

      setCurrentTetromino(newTetromino);
      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid, currentTetromino]);

  // ブロックの自動落下処理
  useEffect(() => {
      console.log('Block position updated:', blockPosition); // デバッグ用
      // }, [blockPosition]);
    const interval = setInterval(() => {
      setBlockPosition((prev) => {
        const newY = prev.y + 1;

        // 下端に到達した場合、または衝突した場合に停止
        if (
          currentTetromino.some((row, rowIndex) =>
            row.some(
              (cell, colIndex) =>
                cell &&
                (grid[prev.y + rowIndex + 1]?.[prev.x + colIndex] !== 0 ||
                  prev.y + rowIndex + 1 >= GRID_HEIGHT)
            )
          )
        ) {
          // ブロックを固定
          const newGrid = [...grid];
          currentTetromino.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
              if (cell) {
                newGrid[prev.y + rowIndex][prev.x + colIndex] = 1;
              }
            });
          });

          // ライン消去処理を実行
          const updatedGrid = clearLines(newGrid);
          setGrid(updatedGrid);

          // 次のブロックを生成
          setCurrentTetromino(TETROMINOES.T); // 次のブロック（仮）
          return { x: 4, y: 0 };
        }

        return { ...prev, y: newY };
      });
    }, 1000); // 1秒ごとに落下

    return () => clearInterval(interval);
  }, [grid, currentTetromino]);

  // グリッドの描画
  const renderGrid = () => {
    const displayGrid = [...grid];
    currentTetromino.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          displayGrid[blockPosition.y + rowIndex][blockPosition.x + colIndex] = 1;
        }
      });
    });

    return displayGrid.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`cell ${cell === 1 ? 'block' : ''}`}
          ></div>
        ))}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>React Tetris</h1>
      <div className="grid-container">{renderGrid()}</div>
    </div>
  );
};

export default App;
