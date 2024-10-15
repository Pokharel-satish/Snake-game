import React, { useState, useEffect } from 'react';
import './App.css';

// Define board dimensions and initial snake speed
const BOARD_SIZE = 10;  // 10x10 grid
const INITIAL_SNAKE = [{ x: 2, y: 2 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const INITIAL_DIRECTION = { x: 1, y: 0 };
const SPEED = 200;  // Snake moves every 200ms

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);

  // Move the snake
  useEffect(() => {
    if (isGameOver) return;

    const handleKeydown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      // Update snake's position
      head.x += direction.x;
      head.y += direction.y;

      // Check if snake hits the wall or itself
      if (head.x >= BOARD_SIZE || head.y >= BOARD_SIZE || head.x < 0 || head.y < 0 ||
        newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      newSnake.unshift(head);  // Add new head

      // Check if snake eats food
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
      } else {
        newSnake.pop();  // Remove tail if no food eaten
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, SPEED);
    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [snake, direction, food, isGameOver]);

  // Generate new food in a random position
  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    return newFood;
  };

  // Render the board and snake
  return (
    <div className="game-container">
      {isGameOver ? (
        <div className="game-over">
          <h1>Game Over</h1>
          <button onClick={() => window.location.reload()}>Restart</button>
        </div>
      ) : (
        <div className="board">
          {[...Array(BOARD_SIZE)].map((_, rowIndex) => (
            <div key={rowIndex} className="row">
              {[...Array(BOARD_SIZE)].map((_, colIndex) => {
                const isSnake = snake.some(segment => segment.x === colIndex && segment.y === rowIndex);
                const isFood = food.x === colIndex && food.y === rowIndex;
                return (
                  <div
                    key={colIndex}
                    className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
