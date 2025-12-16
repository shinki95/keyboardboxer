export interface LeaderboardEntry {
    name: string;
    score: number;
    rank: string;
    timestamp: number;
}

const LEADERBOARD_KEY = 'keyboard_boxer_leaderboard';

export function getLeaderboard(): LeaderboardEntry[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (!stored) return [];
    
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

export function addToLeaderboard(entry: Omit<LeaderboardEntry, 'timestamp'>): LeaderboardEntry[] {
    const leaderboard = getLeaderboard();
    const newEntry: LeaderboardEntry = {
        ...entry,
        timestamp: Date.now()
    };
    
    leaderboard.push(newEntry);
    
    // Sort by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 100 entries (but display top 10)
    const trimmed = leaderboard.slice(0, 100);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
    
    return trimmed;
}

export function getPlayerRanking(score: number): number {
    const leaderboard = getLeaderboard();
    const position = leaderboard.findIndex(entry => entry.score <= score);
    
    if (position === -1) {
        return leaderboard.length + 1;
    }
    
    return position + 1;
}
