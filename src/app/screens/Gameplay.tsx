import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Pause, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const CELL_SIZE = 16;

export function Gameplay() {
  const navigate = useNavigate();
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [nextDirection, setNextDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("snakeHighScore") || "0")
  );
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [baseSpeed] = useState(
    parseInt(localStorage.getItem("snakeDifficulty") || "100")
  );
  const [currentSpeed, setCurrentSpeed] = useState(
    parseInt(localStorage.getItem("snakeDifficulty") || "100")
  );
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const gameLoopRef = useRef<number>();

  // Calculate speed based on score (gets faster as score increases)
  useEffect(() => {
    const speedReduction = Math.floor(score / 100) * 10; // Decrease interval by 10ms every 100 points (slower progression)
    const newSpeed = Math.max(baseSpeed - speedReduction, 60); // Minimum speed of 60ms (slower minimum)
    setCurrentSpeed(newSpeed);
  }, [score, baseSpeed]);

  // Generate random food position
  const generateFood = useCallback((snakeBody: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snakeBody.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return;

    setDirection(nextDirection);

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (nextDirection) {
        case "UP":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "DOWN":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "LEFT":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "RIGHT":
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, isPaused, gameOver, food, generateFood]);

  // Game loop
  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, currentSpeed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, currentSpeed, isPaused, gameOver]);

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("snakeHighScore", score.toString());
      }
      // Track total games played
      const totalGames = parseInt(localStorage.getItem("snakeTotalGames") || "0");
      localStorage.setItem("snakeTotalGames", (totalGames + 1).toString());
      
      // Show game over screen on gameplay first, then navigate
      setShowGameOverScreen(true);
      setTimeout(() => {
        navigate("/game-over", { state: { score, highScore: Math.max(score, highScore) } });
      }, 2500);
    }
  }, [gameOver, score, highScore, navigate]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setIsPaused((prev) => !prev);
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setNextDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setNextDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setNextDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setNextDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 30 && direction !== "LEFT") {
        setNextDirection("RIGHT");
      } else if (deltaX < -30 && direction !== "RIGHT") {
        setNextDirection("LEFT");
      }
    } else {
      if (deltaY > 30 && direction !== "UP") {
        setNextDirection("DOWN");
      } else if (deltaY < -30 && direction !== "DOWN") {
        setNextDirection("UP");
      }
    }

    touchStartRef.current = null;
  };

  const handleDirectionButton = (newDirection: Direction) => {
    switch (newDirection) {
      case "UP":
        if (direction !== "DOWN") setNextDirection("UP");
        break;
      case "DOWN":
        if (direction !== "UP") setNextDirection("DOWN");
        break;
      case "LEFT":
        if (direction !== "RIGHT") setNextDirection("LEFT");
        break;
      case "RIGHT":
        if (direction !== "LEFT") setNextDirection("RIGHT");
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-cyan-400/10">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-cyan-300/60 uppercase">Score</p>
            <motion.p
              key={score}
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {score}
            </motion.p>
          </div>
          <div className="text-center">
            <p className="text-xs text-purple-300/60 uppercase">Best</p>
            <p className="text-2xl font-bold text-purple-400">{highScore}</p>
          </div>
        </div>

        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="w-12 h-12 rounded-xl bg-slate-800/80 border border-cyan-400/20 flex items-center justify-center hover:border-cyan-400/50 transition-all shadow-[0_0_20px_rgba(34,211,238,0.1)]"
        >
          <Pause className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="relative bg-slate-900/30 rounded-3xl overflow-hidden border border-cyan-400/10 shadow-[0_0_40px_rgba(34,211,238,0.1)]"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            }}
          />

          {/* Food */}
          <motion.div
            key={`${food.x}-${food.y}`}
            className="absolute rounded-full"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-600 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Snake */}
          {snake.map((segment, index) => (
            <motion.div
              key={`${segment.x}-${segment.y}-${index}`}
              className="absolute"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
            >
              <div
                className={`w-full h-full rounded-lg ${
                  index === 0
                    ? "bg-gradient-to-br from-cyan-300 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                    : "bg-gradient-to-br from-cyan-400 to-blue-600"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-20 p-4 bg-slate-900/50 backdrop-blur-sm border-t border-cyan-400/10">
        <div className="max-w-sm mx-auto">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button
              onClick={() => handleDirectionButton("UP")}
              className="w-full aspect-square rounded-xl bg-slate-800/80 border border-cyan-400/20 flex items-center justify-center hover:border-cyan-400/50 active:bg-cyan-400/10 transition-all shadow-[0_0_20px_rgba(34,211,238,0.05)]"
            >
              <ArrowUp className="w-6 h-6 text-cyan-400" />
            </button>
            <div />
            <button
              onClick={() => handleDirectionButton("LEFT")}
              className="w-full aspect-square rounded-xl bg-slate-800/80 border border-cyan-400/20 flex items-center justify-center hover:border-cyan-400/50 active:bg-cyan-400/10 transition-all shadow-[0_0_20px_rgba(34,211,238,0.05)]"
            >
              <ArrowLeft className="w-6 h-6 text-cyan-400" />
            </button>
            <button
              onClick={() => handleDirectionButton("DOWN")}
              className="w-full aspect-square rounded-xl bg-slate-800/80 border border-cyan-400/20 flex items-center justify-center hover:border-cyan-400/50 active:bg-cyan-400/10 transition-all shadow-[0_0_20px_rgba(34,211,238,0.05)]"
            >
              <ArrowDown className="w-6 h-6 text-cyan-400" />
            </button>
            <button
              onClick={() => handleDirectionButton("RIGHT")}
              className="w-full aspect-square rounded-xl bg-slate-800/80 border border-cyan-400/20 flex items-center justify-center hover:border-cyan-400/50 active:bg-cyan-400/10 transition-all shadow-[0_0_20px_rgba(34,211,238,0.05)]"
            >
              <ArrowRight className="w-6 h-6 text-cyan-400" />
            </button>
          </div>
          <p className="text-center text-slate-500 text-xs mt-3">
            Swipe on grid or use buttons • Space to pause
          </p>
        </div>
      </div>

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && !gameOver && (
          <motion.div
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.6)]">
                <Pause className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-200 mb-2">Paused</h3>
              <p className="text-slate-400 mb-6">Take a breath</p>
              <button
                onClick={() => setIsPaused(false)}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl text-white font-medium shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all"
              >
                Resume
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game over flash */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="absolute inset-0 bg-red-500 z-30 pointer-events-none"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Game Over Score Display */}
      <AnimatePresence>
        {showGameOverScreen && (
          <motion.div
            className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <motion.h2
                className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-500 to-pink-600 bg-clip-text text-transparent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Game Over
              </motion.h2>

              {/* Score display */}
              <div className="mb-4">
                <p className="text-slate-400 text-sm mb-2">Final Score</p>
                <motion.div
                  className="text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {score}
                </motion.div>
              </div>

              {/* High score indicator */}
              {score > parseInt(localStorage.getItem("snakeHighScore") || "0") - 10 && (
                <motion.p
                  className="text-yellow-400 text-sm mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {score === Math.max(score, highScore) ? "🎉 New High Score! 🎉" : "Great effort!"}
                </motion.p>
              )}

              {/* Loading animation */}
              <motion.div
                className="mt-8 flex justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}