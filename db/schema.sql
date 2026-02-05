-- Mobility Tracker schema (for Supabase)

-- Table: daily_logs
-- Each row represents a user's log for a particular date. Tasks are stored as JSON.

create table if not exists daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  mobility_done boolean default false,
  partial boolean default false,
  tasks jsonb,
  events jsonb default '[]'::jsonb,
  notes text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create unique index if not exists daily_logs_user_date_idx on daily_logs(user_id, date);

-- Optional: friends table (simple mapping)
create table if not exists friends (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  friend_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Sample insert (replace user ids with real ones from your Supabase)
-- insert into daily_logs (user_id, date, mobility_done, tasks) values
-- ('00000000-0000-0000-0000-000000000001', '2026-02-01', true, '[{"id":"t1","title":"20 min mobility","status":"done"}]');
