-- Create Shopping List Table (Check if exists first to avoid errors if partially run)
create table if not exists shopping_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item text not null,
  is_checked boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table shopping_list enable row level security;

-- Policies for Shopping List
create policy "Users can view their own shopping list"
  on shopping_list for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own shopping list"
  on shopping_list for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own shopping list"
  on shopping_list for update
  using (auth.uid() = user_id);

create policy "Users can delete from their own shopping list"
  on shopping_list for delete
  using (auth.uid() = user_id);
