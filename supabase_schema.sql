-- Enable uuid extension
create extension if not exists "pgcrypto";

-- users table (supabase provides auth; keep a profile table)
create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid references auth.users(id),
  display_name text,
  timezone text,
  
  -- Physical Stats
  age integer,
  gender text, -- 'male', 'female', 'other'
  height_cm numeric,
  weight_kg numeric,
  activity_level text, -- 'sedentary', 'light', 'moderate', 'active', 'very_active'
  
  -- Goals & Preferences
  goal text, -- 'fat_loss', 'maintenance', 'muscle_gain'
  dietary_preference text, -- 'omnivore', 'vegetarian', 'vegan', 'keto', 'paleo'
  allergies text[], -- Array of strings: ['nuts', 'dairy', 'gluten']
  medical_conditions text[], -- Array of strings: ['diabetes', 'pcos', 'thyroid']
  
  -- Calculated Targets (AI or Formula based)
  daily_calorie_target numeric,
  daily_protein_target numeric, -- grams
  daily_carbs_target numeric, -- grams
  daily_fat_target numeric, -- grams
  daily_water_target numeric, -- liters
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ingredient catalog (optional) to cache nutrition lookup
create table ingredient_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text, -- e.g., carb/protein/fat/vegetable
  typical_serving_g numeric,
  calories_per_100g numeric,
  carbs_per_100g numeric,
  protein_per_100g numeric,
  fat_per_100g numeric,
  last_updated timestamptz default now()
);

-- food logs
create table food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  image_url text,
  
  -- Analysis Data
  raw_model_output jsonb,
  ingredients jsonb, -- Detailed array of ingredients with individual macros
  
  -- Totals
  total_calories numeric,
  total_carbs numeric,
  total_protein numeric,
  total_fat numeric,
  total_fiber numeric, -- New
  total_sugar numeric, -- New
  
  -- Health & Insights
  health_score numeric, -- 0-100
  glycemic_load text, -- 'low', 'medium', 'high' (AI predicted)
  warnings text[], -- ['high_sugar', 'low_protein']
  
  meal_type text, -- 'breakfast', 'lunch', 'dinner', 'snack'
  created_at timestamptz default now()
);

create index on food_logs (user_id);
