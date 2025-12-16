// Use require to bypass faulty ESM wrapper in @supabase/supabase-js v2
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require('@supabase/supabase-js');

// Ensure we're in a browser environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeaderboardEntry {
    id?: string;
    name: string;
    score: number;
    rank: string;
    created_at?: string;
}

/**
 * Fetch all leaderboard entries, sorted by score (descending)
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('score', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

/**
 * Add a new entry to the leaderboard
 */
export async function addToLeaderboard(entry: Omit<LeaderboardEntry, 'id' | 'created_at'>): Promise<LeaderboardEntry[]> {
    try {
        const { error } = await supabase
            .from('leaderboard')
            .insert([{
                name: entry.name,
                score: entry.score,
                rank: entry.rank,
            }]);

        if (error) {
            console.error('Error adding to leaderboard:', error);
            throw error;
        }

        // Fetch updated leaderboard
        return await getLeaderboard();
    } catch (error) {
        console.error('Error adding to leaderboard:', error);
        throw error;
    }
}

/**
 * Get player's ranking position based on score
 */
export async function getPlayerRanking(score: number): Promise<number> {
    try {
        const { count, error } = await supabase
            .from('leaderboard')
            .select('*', { count: 'exact', head: true })
            .gt('score', score);

        if (error) {
            console.error('Error getting player ranking:', error);
            return -1;
        }

        return (count || 0) + 1;
    } catch (error) {
        console.error('Error getting player ranking:', error);
        return -1;
    }
}
