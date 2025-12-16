"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideQuote, Zap } from "lucide-react";
import ResultView from "./components/ResultView";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; rank: string; comment: string; effect: string } | null>(null);

  // Check for shared result in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlScore = params.get('score');
    const urlRank = params.get('rank');
    const urlComment = params.get('comment');

    if (urlScore && urlRank && urlComment) {
      // Auto-display shared result
      setResult({
        score: parseInt(urlScore),
        rank: urlRank,
        comment: urlComment,
        effect: 'none', // Default effect for shared results
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/v1/punch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input, user_id: "user_v1" }), // ID is optional/placeholder
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      // Fallback result handled by API usually, but if fetch fails:
      setResult({
        score: 0,
        rank: "C",
        comment: "Critical System Failure... Network Error!",
        effect: "none"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setResult(null);
    setInput("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black overflow-hidden relative">
      {/* CSS Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />


      <div className="z-10 w-full max-w-3xl flex flex-col items-center space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-flicker drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            I AM KEYBOARD BOXER
          </h1>
          <p className="text-primary text-sm md:text-base tracking-widest uppercase">
            Text-Based Physics Engine v1.0
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="w-full flex flex-col items-center space-y-8"
            >
              <div className="w-full relative group">
                <input
                  type="text"
                  maxLength={50}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your punch..."
                  disabled={loading}
                  className="w-full bg-black/50 border-2 border-zinc-700 focus:border-primary text-white text-xl md:text-2xl p-6 rounded-xl outline-none transition-all duration-300 placeholder:text-zinc-600 text-center shadow-[0_0_0_0_rgba(0,0,0,0)] focus:shadow-[0_0_20px_var(--color-primary)]"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-600 font-mono text-xs">
                  {input.length}/50
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleSubmit(e)}
                disabled={loading || !input.trim()}
                className={`
                  relative px-12 py-6 rounded-none skew-x-[-10deg]
                  ${loading ? 'bg-zinc-800 cursor-not-allowed' : 'bg-primary hover:bg-white cursor-pointer'}
                  transition-all duration-200 group
                `}
              >
                <div className="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-200" />
                <span className={`block skew-x-[10deg] text-2xl font-black tracking-widest ${loading ? 'text-zinc-500' : 'text-black'}`}>
                  {loading ? 'CHARGING...' : 'PUNCH!'}
                </span>

                {loading && (
                  <div className="absolute bottom-0 left-0 h-1 bg-secondary animate-pulse w-full" />
                )}
              </motion.button>

              <div className="text-zinc-500 text-xs text-center max-w-md">
                * Your description determines the physics calculation. <br />
                Use creative adjectives and scale for higher scores.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-screen"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="w-full flex justify-center"
            >
              <ResultView
                score={result.score}
                rank={result.rank}
                comment={result.comment}
                effect={result.effect}
                onReset={resetGame}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
