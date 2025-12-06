-- Water Logs Table
create table if not exists water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  amount_ml int not null,
  created_at timestamptz default now()
);

alter table water_logs enable row level security;

create policy "Users can view their own water logs"
  on water_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own water logs"
  on water_logs for insert with check (auth.uid() = user_id);

create policy "Users can delete their own water logs"
  on water_logs for delete using (auth.uid() = user_id);
