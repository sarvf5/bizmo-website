-- Launch sign-ups for bizmousa.com. Run once in the Supabase SQL editor.
create table if not exists public.launch_signups (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 254),
  city        text not null check (char_length(city) between 1 and 120),
  user_agent  text,
  unique (email)
);

-- Only the server (service role) writes; nobody can read through the public API.
alter table public.launch_signups enable row level security;
