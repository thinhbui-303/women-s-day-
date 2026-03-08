import React, { useEffect, useRef, useState } from 'react';
import './DinoGame.css';

const DinoGame = ({ onGameComplete }) => {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Constants
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const GROUND_Y = 250;
  const PLAYER_WIDTH = 40;
  const PLAYER_HEIGHT = 60;
  const OBSTACLE_WIDTH = 30;
  const OBSTACLE_HEIGHT = 40;
  const WIN_SCORE = 830;

  // Refs for logic (to avoid re-renders)
  const gameState = useRef({
    player: {
      x: 50,
      y: GROUND_Y - PLAYER_HEIGHT,
      dy: 0,
      isJumping: false,
    },
    obstacles: [],
    frameCount: 0,
    currentScore: 0,
    speed: 5,
  });

  const resetGame = () => {
    gameState.current = {
      player: {
        x: 50,
        y: GROUND_Y - PLAYER_HEIGHT,
        dy: 0,
        isJumping: false,
      },
      obstacles: [],
      frameCount: 0,
      currentScore: 0,
      speed: 5,
    };
    setGameOver(false);
    setScore(0);
    setIsGameStarted(true);
  };

  const jump = () => {
    if (!gameState.current.player.isJumping && isGameStarted && !gameOver) {
      gameState.current.player.dy = JUMP_STRENGTH;
      gameState.current.player.isJumping = true;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (gameOver) {
          resetGame();
        } else if (!isGameStarted) {
          setIsGameStarted(true);
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isGameStarted]);

  useEffect(() => {
    if (!isGameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const update = () => {
      const state = gameState.current;

      // Update Player
      state.player.dy += GRAVITY;
      state.player.y += state.player.dy;

      if (state.player.y > GROUND_Y - PLAYER_HEIGHT) {
        state.player.y = GROUND_Y - PLAYER_HEIGHT;
        state.player.dy = 0;
        state.player.isJumping = false;
      }

      // Update Obstacles
      if (state.frameCount % 100 === 0) {
        state.obstacles.push({
          x: canvas.width,
          y: GROUND_Y - OBSTACLE_HEIGHT,
        });
      }

      state.obstacles.forEach((obs, index) => {
        obs.x -= state.speed;

        // Collision detection
        if (
          state.player.x < obs.x + OBSTACLE_WIDTH &&
          state.player.x + PLAYER_WIDTH > obs.x &&
          state.player.y < obs.y + OBSTACLE_HEIGHT &&
          state.player.y + PLAYER_HEIGHT > obs.y
        ) {
          setGameOver(true);
          cancelAnimationFrame(animationId);
        }

        // Remove off-screen obstacles
        if (obs.x + OBSTACLE_WIDTH < 0) {
          state.obstacles.splice(index, 1);
        }
      });

      // Update Score & Speed
      state.currentScore += 1;
      setScore(state.currentScore);
      
      // Speed up over time
      if (state.currentScore % 200 === 0) {
        state.speed += 0.5;
      }

      // Win Condition
      if (state.currentScore >= WIN_SCORE) {
        onGameComplete();
        cancelAnimationFrame(animationId);
      }

      state.frameCount++;
    };

    const draw = () => {
      const state = gameState.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Ground
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(canvas.width, GROUND_Y);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Player (Boy Character)
      ctx.fillStyle = '#4cc9f0';
      ctx.fillRect(state.player.x, state.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
      // Simple face
      ctx.fillStyle = '#fff';
      ctx.fillRect(state.player.x + PLAYER_WIDTH - 15, state.player.y + 10, 5, 5);
      ctx.fillStyle = '#000';
      ctx.fillRect(state.player.x + PLAYER_WIDTH - 12, state.player.y + 12, 2, 2);

      // Draw Obstacles (Monsters)
      ctx.fillStyle = '#f72585';
      state.obstacles.forEach((obs) => {
        // Red spikey monster
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + OBSTACLE_HEIGHT);
        ctx.lineTo(obs.x + OBSTACLE_WIDTH / 2, obs.y);
        ctx.lineTo(obs.x + OBSTACLE_WIDTH, obs.y + OBSTACLE_HEIGHT);
        ctx.fill();
        
        // Eyes for the monster
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(obs.x + OBSTACLE_WIDTH/2 - 5, obs.y + 25, 3, 0, Math.PI * 2);
        ctx.arc(obs.x + OBSTACLE_WIDTH/2 + 5, obs.y + 25, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f72585';
      });
    };

    const gameLoop = () => {
      update();
      draw();
      if (!gameOver) {
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isGameStarted, gameOver, onGameComplete]);

  return (
    <div className="game-container" onClick={jump}>
      <div className="game-overlay">
        <div className="score-display">Poin't: {score} / {WIN_SCORE}</div>
        {!isGameStarted && (
          <div className="start-prompt">
            <h2>NHẤN CÁCH (SPACE) HOẶC CLICK ĐỂ NHẢY</h2>
            <p>Đạt 830 điểm để giải cứu thành công!</p>
          </div>
        )}
        {gameOver && (
          <div className="game-over">
            <h2>BẠN ĐÃ BỊ BẮT!</h2>
            <button className="restart-button" onClick={(e) => { e.stopPropagation(); resetGame(); }}>
              CHƠI LẠI
            </button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} width={800} height={350} />
      
      <div className="game-instructions">
        <span>Space | Click to Jump</span>
      </div>
    </div>
  );
};

export default DinoGame;
