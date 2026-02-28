import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Play, Trophy, Volume2 } from "lucide-react";

export function MainMenu() {
  const navigate = useNavigate();
  const highScore = localStorage.getItem("snakeHighScore") || "0";

  const menuItems = [
    { label: "Play Game", icon: Play, action: () => navigate("/difficulty") },
    { label: "High Score", icon: Trophy, action: () => navigate("/high-score") },
    { label: "Sound", icon: Volume2, action: () => {} },
  ];

  return (
    <div className="fixed inset-0 bg-[#0F172A] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
          animate={{
            y: [0, -100],
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

      <div className="relative z-10 w-full max-w-sm">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            SNAKE
          </h1>
          <div className="flex items-center justify-center gap-2 text-cyan-300/60">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-400/50" />
            <p className="text-xs tracking-[0.3em] uppercase">Premium</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-400/50" />
          </div>
        </motion.div>

        {/* High Score Display */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-block bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-2xl px-6 py-3 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <p className="text-cyan-300/60 text-xs mb-1">High Score</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {highScore}
            </p>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.action}
              className="w-full bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-4 flex items-center justify-between group hover:border-cyan-400/50 transition-all shadow-[0_0_20px_rgba(34,211,238,0.05)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
                  <item.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-slate-200 font-medium">{item.label}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center group-hover:bg-cyan-400/20 transition-all">
                <div className="w-2 h-2 border-t-2 border-r-2 border-cyan-400 rotate-45" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          className="text-center text-slate-500 text-xs mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Swipe to control • Tap to pause
        </motion.p>
      </div>
    </div>
  );
}