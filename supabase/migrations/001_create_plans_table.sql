-- Plans table: stores user-generated investment plans
create table if not exists plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  input jsonb not null,        -- UserInput object
  plan jsonb not null,         -- InvestmentPlan object
  created_at timestamptz default now() not null
);

-- Index for fast user lookups
create index idx_plans_user_id on plans(user_id);
create index idx_plans_created_at on plans(created_at desc);

-- Row Level Security: users can only see their own plans
alter table plans enable row level security;

create policy "Users can view their own plans"
  on plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own plans"
  on plans for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own plans"
  on plans for delete
  using (auth.uid() = user_id);
