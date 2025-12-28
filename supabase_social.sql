
-- Social Features Schema

-- Friendships
create table friendships (
  id uuid primary key default gen_random_uuid(),
  user_id_1 uuid references profiles(id) not null,
  user_id_2 uuid references profiles(id) not null,
  status text default 'pending', -- 'pending', 'accepted', 'blocked'
  created_at timestamptz default now()
);

-- Unique constraint to prevent duplicate friendships
create unique index on friendships (least(user_id_1, user_id_2), greatest(user_id_1, user_id_2));

-- Leaderboard scores (calculated daily/weekly)
create table leaderboard_scores (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references profiles(id) not null,
    period_start date, -- e.g., Monday of the week
    period_type text default 'weekly', -- 'weekly', 'all_time'
    score integer default 0,
    rank integer,
    created_at timestamptz default now()
);

-- Duels / Challenges
create table duels (
    id uuid primary key default gen_random_uuid(),
    challenger_id uuid references profiles(id) not null,
    opponent_id uuid references profiles(id) not null,
    duel_type text, -- 'streak', 'calories_under', 'protein_goal'
    status text default 'active', -- 'active', 'completed', 'declined'
    start_date timestamptz default now(),
    end_date timestamptz,
    winner_id uuid references profiles(id),
    created_at timestamptz default now()
);

-- RLS
alter table friendships enable row level security;
alter table leaderboard_scores enable row level security;
alter table duels enable row level security;

-- Policies (Simplified for demo)
create policy "Public read friendships" on friendships for select using (true);
create policy "Users can insert friendships" on friendships for insert with check (true);
create policy "Public read leaderboards" on leaderboard_scores for select using (true);
create policy "Public read duels" on duels for select using (true);
