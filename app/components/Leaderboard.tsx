"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { type LeaderboardEntry } from "../utils/supabase-leaderboard";

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    onClose: () => void;
}

export default function Leaderboard({ entries, onClose }: LeaderboardProps) {
    const top10 = entries.slice(0, 10);

    const getRankIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Trophy className="w-6 h-6 text-yellow-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-300" />;
            case 3:
                return <Award className="w-6 h-6 text-amber-600" />;
            default:
                return <span className="text-zinc-500 font-bold">#{position}</span>;
        }
    };

    const getRowClass = (position: number) => {
        if (position <= 3) {
            return "bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-yellow-400 animate-shimmer";
        }
        return "bg-zinc-800/50";
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-zinc-900 border-4 border-primary rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary mb-2">
                        LEADERBOARD
                    </h2>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest">
                        Top 10 Keyboard Boxers
                    </p>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-3">
                    {top10.length === 0 ? (
                        <div className="text-center text-zinc-500 py-12">
                            No entries yet. Be the first!
                        </div>
                    ) : (
                        top10.map((entry, index) => {
                            const position = index + 1;
                            return (
                                <motion.div
                                    key={entry.id || `${entry.name}-${entry.score}-${index}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`${getRowClass(position)} rounded-lg p-4 flex items-center justify-between gap-4 transition-all hover:scale-[1.02]`}
                                >
                                    {/* Rank Icon */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="flex-shrink-0 w-8 flex justify-center">
                                            {getRankIcon(position)}
                                        </div>

                                        {/* Name */}
                                        <div className={`font-bold text-lg truncate ${position <= 3 ? 'text-white text-glow' : 'text-zinc-300'}`}>
                                            {entry.name}
                                        </div>
                                    </div>

                                    {/* Score and Rank */}
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className={`text-2xl font-mono font-bold ${position <= 3 ? 'text-primary animate-pulse' : 'text-white'}`}>
                                            {entry.score.toString().padStart(4, '0')}
                                        </div>
                                        <div className={`px-3 py-1 rounded font-black text-sm ${entry.rank === 'KO'
                                            ? 'bg-gradient-to-r from-yellow-400 to-red-500 text-black'
                                            : 'bg-zinc-700 text-white'
                                            }`}>
                                            {entry.rank}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Close Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="mt-8 w-full px-8 py-4 bg-primary hover:bg-white text-black font-black uppercase tracking-widest transition-colors duration-200"
                >
                    Close
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
