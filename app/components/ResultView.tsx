"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

interface ResultViewProps {
    score: number;
    rank: string;
    comment: string;
    effect: string; // "wind", "impact", "explosion", "cosmic_horror"
    onReset: () => void;
}

export default function ResultView({ score, rank, comment, effect, onReset }: ResultViewProps) {
    const [displayScore, setDisplayScore] = useState(0);
    const resultRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);

    // Score Counting Animation
    useEffect(() => {
        let start = 0;
        const end = score;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out expo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setDisplayScore(Math.floor(end * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    // Effect Handling (Visuals)
    const getEffectClass = () => {
        switch (effect) {
            case "wind": return "animate-pulse";
            case "impact": return "animate-shake"; // Custom shake
            case "explosion": return "bg-red-900 animate-pulse"; // Removed /30 opacity to safe color
            case "cosmic_horror": return "invert"; // Removed backdrop-blur
            default: return "";
        }
    };

    const handleShare = async () => {
        if (isSharing) return;
        setIsSharing(true);

        // Create shareable URL with result data
        const params = new URLSearchParams({
            score: score.toString(),
            rank: rank,
            comment: comment,
        });
        const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

        const shareData = {
            title: 'I AM KEYBOARD BOXER',
            text: `내 파괴력 등급: ${rank} (${score}점)\nAI 평가: "${comment}"\n#KeyboardBoxer`,
            url: shareUrl,
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: Copy to Clipboard
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareUrl}`);
                alert("결과 링크가 클립보드에 복사되었습니다!");
            }
        } catch (e) {
            console.error("Share failed", e);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl">
            {/* Capture Area */}
            <div
                ref={resultRef}
                // Compatibility: Strict INLINE styles for colors. NO Tailwind opacity classes.
                className={`flex flex-col items-center justify-center w-full p-8 space-y-8 text-center rounded-xl border-4 border-[#00f0ff] ${getEffectClass()}`}
                style={{
                    backgroundColor: 'rgba(5, 5, 16, 0.95)', // Replaces bg-black/90
                    color: 'white'
                }}
            >

                {/* Rank Badge */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                    // Compatibility: Text Gradient logic
                    className="text-6xl md:text-8xl font-black drop-shadow-[0_0_15px_#00f0ff]"
                    style={{
                        color: 'transparent',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        backgroundImage: 'linear-gradient(135deg, #00f0ff 0%, #ff00ff 100%)' // Standard gradient
                    }}
                >
                    {rank}
                </motion.div>

                {/* Score */}
                <div className="flex flex-col space-y-2">
                    <span className="text-secondary text-sm uppercase tracking-widest animate-pulse" style={{ color: '#ff00ff' }}>Destructive Power</span>
                    <span className="text-5xl md:text-7xl font-bold font-mono text-white text-glow">
                        {displayScore.toString().padStart(4, '0')}
                    </span>
                    <span className="text-zinc-500 text-xs mt-2">I AM KEYBOARD BOXER</span>
                </div>

                {/* Comment Bubble (Desktop) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="hidden md:block relative p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    style={{ backgroundColor: '#18181b', border: '2px solid white' }} // bg-zinc-900 equivalent
                >
                    <div
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
                        style={{ backgroundColor: '#18181b', borderTop: '2px solid white', borderLeft: '2px solid white' }}
                    ></div>
                    <p className="text-lg md:text-xl leading-relaxed">
                        "{comment}"
                    </p>
                </motion.div>

                {/* Mobile Comment (Always visible in capture) */}
                <div
                    className="md:hidden relative p-4 rounded-lg shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                    style={{ backgroundColor: '#18181b', border: '2px solid white' }}
                >
                    <p className="text-lg leading-relaxed">"{comment}"</p>
                </div>

            </div>

            {/* Action Buttons (Outside Capture) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-8"
            >
                <button
                    onClick={onReset}
                    className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wider transition-colors duration-200"
                >
                    Punch Again
                </button>

                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="px-8 py-3 bg-secondary hover:bg-primary text-black font-bold uppercase tracking-wider transition-colors duration-200 box-glow disabled:opacity-50"
                    style={{ backgroundColor: isSharing ? '#333' : '#ff00ff' }}
                >
                    {isSharing ? 'Sharing...' : 'Share Result'}
                </button>
            </motion.div>

        </div>
    );
}
