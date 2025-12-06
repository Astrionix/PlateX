-- Progress Photos Table
create table if not exists progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  image_url text not null,
  weight_kg numeric,
  notes text,
  created_at timestamptz default now()
);

-- RLS
alter table progress_photos enable row level security;

create policy "Users can view own photos"
  on progress_photos for select using (auth.uid() = user_id);

create policy "Users can upload own photos"
  on progress_photos for insert with check (auth.uid() = user_id);

create policy "Users can delete own photos"
  on progress_photos for delete using (auth.uid() = user_id);
