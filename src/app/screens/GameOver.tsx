import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { RotateCcw, Home, Trophy } from "lucide-react";

export function GameOver() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 0, highScore = 0 } = (location.state as { score: number; highScore: number }) || {};

  const isNewHighScore = score === highScore && score > 0;

  return (
    <div className="fixed inset-0 bg-[#0F172A] flex items-center justify-center p-6 overflow-hidden">
      {/* Background particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          initial={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            opacity: 1,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.5,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-sm">
        {/* Game Over Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <motion.h1
            className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-400 via-purple-500 to-pink-600 bg-clip-text text-transparent"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Game Over
          </motion.h1>
          <p className="text-slate-400">Better luck next time!</p>
        </motion.div>

        {/* Score cards */}
        <div className="space-y-4 mb-8">
          {/* Current Score */}
          <motion.div
            className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-cyan-300/60 text-sm mb-2">Your Score</p>
            <motion.p
              className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              {score}
            </motion.p>
          </motion.div>

          {/* High Score */}
          <motion.div
            className={`relative bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm border rounded-2xl p-6 text-center overflow-hidden ${
              isNewHighScore
                ? "border-yellow-400/50 shadow-[0_0_40px_rgba(250,204,21,0.3)]"
                : "border-purple-400/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isNewHighScore && (
              <>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{
                      x: "50%",
                      y: "50%",
                      scale: 0,
                    }}
                    animate={{
                      x: Math.random() * 100 + "%",
                      y: Math.random() * 100 + "%",
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: Math.random() * 0.5,
                    }}
                  />
                ))}
              </>
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className={`w-4 h-4 ${isNewHighScore ? "text-yellow-400" : "text-purple-400"}`} />
                <p className={`text-sm ${isNewHighScore ? "text-yellow-400" : "text-purple-300/60"}`}>
                  {isNewHighScore ? "New High Score!" : "High Score"}
                </p>
              </div>
              <p className={`text-4xl font-bold ${isNewHighScore ? "text-yellow-400" : "text-purple-400"}`}>
                {highScore}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={() => navigate("/play")}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-2xl py-4 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-white font-bold text-lg">Play Again</span>
          </motion.button>

          <motion.button
            onClick={() => navigate("/menu")}
            className="w-full bg-slate-800/80 backdrop-blur-sm border border-cyan-400/20 rounded-2xl py-4 flex items-center justify-center gap-3 hover:border-cyan-400/50 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-200 font-medium">Main Menu</span>
          </motion.button>
        </div>

        {/* Footer */}
        <motion.p
          className="text-center text-slate-500 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {isNewHighScore
            ? "🎉 Congratulations on your new record!"
            : "Keep practicing to beat your high score!"}
        </motion.p>
      </div>
    </div>
  );
}
