-- ============================================================
-- Supabase Schema for Komorebi Learning
-- Import this SQL into your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- Table: profiles
-- ============================================================
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  display_name text,
  avatar_url text,
  email text,
  level integer default 1,
  xp integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Table: lessons
-- ============================================================
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  description text,
  unit_number integer not null,
  status text default 'locked',
  xp_reward integer default 50,
  estimated_minutes integer default 10,
  order_index integer default 0,
  color text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Table: user_progress
-- ============================================================
create table public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  lesson_id uuid references public.lessons not null,
  xp integer default 0,
  level integer default 1,
  total_xp integer default 0,
  streak integer default 0,
  last_completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- Table: daily_goals
-- ============================================================
create table public.daily_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  completed integer default 0,
  total integer default 5,
  xp integer default 0,
  date date default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Unique constraint: one daily goal per user per date
create unique index daily_goals_user_date_idx on public.daily_goals (user_id, date);

-- ============================================================
-- Sample Data: Lessons
-- ============================================================
insert into public.lessons (id, title, subtitle, description, unit_number, status, xp_reward, estimated_minutes, order_index, color) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Hiragana (ひらがな)', null, 'Learn hiragana characters', 1, 'completed', 50, 15, 1, '#864e5a'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Katakana (カタカナ)', null, 'Learn katakana characters', 2, 'completed', 50, 15, 2, '#ba002c'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'N5 Grammar Intro', null, 'Basic Japanese grammar patterns', 3, 'in_progress', 100, 30, 3, '#516161'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Basic Greetings', null, 'Common Japanese greetings', 4, 'locked', 50, 10, 4, '#864e5a'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Numbers & Time', null, 'Counting and telling time', 5, 'locked', 50, 10, 5, '#ba002c');

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;
alter table public.daily_goals enable row level security;

-- Profiles: users can view all, edit their own
create policy "Users can view all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Lessons: everyone can read
create policy "Everyone can read lessons" on public.lessons for select using (true);

-- User progress: users can CRUD their own progress
create policy "Users can read own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);

-- Daily goals: users can CRUD their own daily goals
create policy "Users can read own daily goals" on public.daily_goals for select using (auth.uid() = user_id);
create policy "Users can insert own daily goals" on public.daily_goals for insert with check (auth.uid() = user_id);
create policy "Users can update own daily goals" on public.daily_goals for update using (auth.uid() = user_id);

-- ============================================================
-- Functions
-- ============================================================

-- get_user_lessons: Returns lessons with user-specific status/progress
create or replace function public.get_user_lessons(user_id uuid)
returns table (
  id uuid,
  title text,
  status text,
  progress integer,
  unit_number integer
)
language plpgsql
security definer
as $$
begin
  return query
  select
    l.id,
    l.title,
    l.status,
    coalesce(up.progress, 0) as progress,
    l.unit_number
  from public.lessons l
  left join (
    select lesson_id, (xp / nullif(l.xp_reward, 0) * 100) as progress
    from public.user_progress up
    join public.lessons l on up.lesson_id = l.id
    where up.user_id = get_user_lessons.user_id
  ) up on l.id = up.lesson_id
  order by l.order_index asc;
end;
$$;

-- get_daily_goal: Returns the user's daily goal progress
create or replace function public.get_daily_goal(user_id uuid)
returns table (
  completed integer,
  total integer,
  xp integer
)
language plpgsql
security definer
as $$
begin
  return query
  select
    coalesce(dg.completed, 0) as completed,
    coalesce(dg.total, 5) as total,
    coalesce(dg.xp, 0) as xp
  from public.daily_goals dg
  where dg.user_id = get_daily_goal.user_id
    and dg.date = current_date
  limit 1;

  if not found then
    return query select 0::integer as completed, 5::integer as total, 0::integer as xp;
  end if;
end;
$$;

-- complete_lesson: Marks a lesson as completed and awards XP
create or replace function public.complete_lesson(
  user_id uuid,
  lesson_id text,
  xp_earned integer
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_total_xp integer;
  v_current_streak integer;
  v_today integer;
begin
  -- Update or insert user progress
  insert into public.user_progress (user_id, lesson_id, xp, total_xp, level, streak, last_completed_at, created_at, updated_at)
  values (
    user_id, lesson_id, xp_earned,
    (select coalesce(sum(xp), 0) from public.user_progress where user_progress.user_id = user_id) + xp_earned,
    ceil((select coalesce(sum(xp), 0) from public.user_progress where user_progress.user_id = user_id) / 100.0),
    (select coalesce(streak, 0) from public.user_progress where user_progress.user_id = user_id and user_progress.lesson_id = lesson_id),
    now(), now(), now()
  )
  on conflict (user_id) do update
  set xp = user_progress.xp + xp_earned,
      total_xp = user_progress.total_xp + xp_earned,
      last_completed_at = now(),
      updated_at = now();

  -- Update daily goal
  insert into public.daily_goals (user_id, completed, total, xp, date, created_at, updated_at)
  values (user_id, 1, 5, xp_earned, current_date, now(), now())
  on conflict (user_id, date) do update
  set completed = daily_goals.completed + 1,
      xp = daily_goals.xp + xp_earned,
      updated_at = now();

  return true;
exception
  when others then
    return false;
end;
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, email, level, xp)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email, 1, 0);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
