import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, Trophy, Crown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export function HighScore() {
  const navigate = useNavigate();
  const [displayScore, setDisplayScore] = useState(0);
  const actualHighScore = parseInt(localStorage.getItem("snakeHighScore") || "0");
  const totalGamesPlayed = parseInt(localStorage.getItem("snakeTotalGames") || "0");

  // Animate score counting up
  useEffect(() => {
    if (displayScore < actualHighScore) {
      const increment = Math.ceil(actualHighScore / 50);
      const timer = setTimeout(() => {
        setDisplayScore((prev) => Math.min(prev + increment, actualHighScore));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [displayScore, actualHighScore]);

  return (
    <div className="fixed inset-0 bg-[#0F172A] flex flex-col p-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          animate={{
            y: [0, -100],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            bottom: 0,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate("/menu")}
            className="w-10 h-10 rounded-xl bg-slate-800/50 border border-cyan-400/20 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-400" />
          </button>
          <h2 className="flex-1 text-center text-2xl font-bold text-slate-200 -ml-10">
            High Score
          </h2>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {/* Trophy icon */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <div className="relative">
              {/* Glowing background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.6)] rotate-12">
                <Crown className="w-16 h-16 text-white" />
              </div>

              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 8) * 80,
                    y: Math.sin((i * Math.PI * 2) / 8) * 80,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* High Score Display */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-slate-400 text-sm mb-3">All-Time Best</p>
            <motion.div
              className="text-8xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-600 bg-clip-text text-transparent"
              animate={{
                textShadow: [
                  "0 0 20px rgba(250, 204, 21, 0.5)",
                  "0 0 40px rgba(250, 204, 21, 0.8)",
                  "0 0 20px rgba(250, 204, 21, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {displayScore}
            </motion.div>
            <motion.p
              className="text-cyan-300/60 text-xs mt-2 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Points
            </motion.p>
          </motion.div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-4 text-center shadow-[0_0_20px_rgba(34,211,238,0.05)]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Trophy className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-cyan-400">{totalGamesPlayed}</p>
              <p className="text-slate-500 text-xs mt-1">Games Played</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-4 text-center shadow-[0_0_20px_rgba(168,85,247,0.05)]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">
                {totalGamesPlayed > 0 ? Math.round(actualHighScore / totalGamesPlayed) : 0}
              </p>
              <p className="text-slate-500 text-xs mt-1">Avg Score</p>
            </motion.div>
          </div>

          {/* Motivational message */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="inline-block bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-full px-6 py-3">
              <p className="text-yellow-400 text-sm font-medium">
                {actualHighScore === 0
                  ? "🎮 Play your first game to set a record!"
                  : actualHighScore < 100
                  ? "🔥 Keep going! You're getting better!"
                  : actualHighScore < 300
                  ? "💪 Impressive! Can you reach 300?"
                  : "🏆 You're a Snake Master!"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Back button */}
        <motion.button
          onClick={() => navigate("/menu")}
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-2xl py-4 text-white font-bold shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to Menu
        </motion.button>
      </div>
    </div>
  );
}
