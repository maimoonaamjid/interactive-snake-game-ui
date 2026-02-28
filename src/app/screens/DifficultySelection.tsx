import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";

interface Difficulty {
  name: string;
  speed: number;
  color: string;
  description: string;
}

const difficulties: Difficulty[] = [
  {
    name: "Easy",
    speed: 200,
    color: "from-green-400 to-emerald-600",
    description: "Perfect for beginners",
  },
  {
    name: "Medium",
    speed: 140,
    color: "from-cyan-400 to-blue-600",
    description: "Balanced challenge",
  },
  {
    name: "Hard",
    speed: 90,
    color: "from-purple-400 to-pink-600",
    description: "For the brave ones",
  },
];

export function DifficultySelection() {
  const navigate = useNavigate();

  const handleSelect = (difficulty: Difficulty) => {
    localStorage.setItem("snakeDifficulty", difficulty.speed.toString());
    navigate("/play");
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A] flex flex-col p-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

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
            Select Difficulty
          </h2>
        </motion.div>

        {/* Difficulty cards */}
        <div className="flex-1 flex flex-col justify-center gap-6 max-w-sm mx-auto w-full">
          {difficulties.map((difficulty, index) => (
            <motion.button
              key={difficulty.name}
              onClick={() => handleSelect(difficulty)}
              className="relative bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-cyan-400/20 rounded-3xl p-6 overflow-hidden group hover:border-cyan-400/50 transition-all shadow-[0_0_20px_rgba(34,211,238,0.05)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient overlay */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${difficulty.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-all`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-slate-200">
                    {difficulty.name}
                  </h3>
                  <div className={`w-12 h-12 bg-gradient-to-br ${difficulty.color} rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center`}>
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white rotate-45" />
                  </div>
                </div>

                <p className="text-slate-400 text-sm">{difficulty.description}</p>

                {/* Speed indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="text-xs text-cyan-300/60 uppercase tracking-wider">
                    Speed
                  </div>
                  <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${difficulty.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - (difficulty.speed / 150 * 100)}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer tip */}
        <motion.div
          className="text-center text-slate-500 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Choose wisely - the higher the difficulty,</p>
          <p>the greater the glory!</p>
        </motion.div>
      </div>
    </div>
  );
}