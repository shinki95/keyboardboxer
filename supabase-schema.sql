-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    score INTEGER NOT NULL,
    rank VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on score for faster sorting
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read leaderboard
CREATE POLICY "Allow public read access" ON leaderboard
    FOR SELECT
    USING (true);

-- Create policy to allow anyone to insert into leaderboard
CREATE POLICY "Allow public insert access" ON leaderboard
    FOR INSERT
    WITH CHECK (true);

-- Optional: Add a policy to prevent updates and deletes
CREATE POLICY "Prevent updates" ON leaderboard
    FOR UPDATE
    USING (false);

CREATE POLICY "Prevent deletes" ON leaderboard
    FOR DELETE
    USING (false);
