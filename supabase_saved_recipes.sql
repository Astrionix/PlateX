-- Saved Recipes Table for PlateX
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS saved_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    time TEXT DEFAULT '30 mins',
    calories INTEGER DEFAULT 0,
    ingredients JSONB DEFAULT '[]'::jsonb,
    instructions TEXT,
    meal_type TEXT DEFAULT 'Snack',
    planned_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own recipes
CREATE POLICY "Users can view own recipes" ON saved_recipes
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own recipes
CREATE POLICY "Users can insert own recipes" ON saved_recipes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own recipes
CREATE POLICY "Users can update own recipes" ON saved_recipes
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own recipes
CREATE POLICY "Users can delete own recipes" ON saved_recipes
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_planned_date ON saved_recipes(planned_date);
