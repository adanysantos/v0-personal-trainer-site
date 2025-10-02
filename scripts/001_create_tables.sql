-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  user_type text not null check (user_type in ('instructor', 'student')),
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Instructors can view all student profiles
create policy "instructors_view_students"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and user_type = 'instructor'
    )
  );

-- Create workout plans table
create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  student_id uuid not null references public.profiles(id) on delete cascade,
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.workout_plans enable row level security;

-- Workout plans policies
create policy "students_view_own_plans"
  on public.workout_plans for select
  using (auth.uid() = student_id);

create policy "instructors_view_own_plans"
  on public.workout_plans for select
  using (auth.uid() = instructor_id);

create policy "instructors_insert_plans"
  on public.workout_plans for insert
  with check (auth.uid() = instructor_id);

create policy "instructors_update_own_plans"
  on public.workout_plans for update
  using (auth.uid() = instructor_id);

create policy "instructors_delete_own_plans"
  on public.workout_plans for delete
  using (auth.uid() = instructor_id);

-- Create exercises table
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
  name text not null,
  sets integer not null,
  reps text not null,
  rest_time text,
  notes text,
  order_index integer not null default 0,
  created_at timestamp with time zone default now()
);

alter table public.exercises enable row level security;

-- Exercises policies (inherit from workout_plans)
create policy "students_view_plan_exercises"
  on public.exercises for select
  using (
    exists (
      select 1 from public.workout_plans
      where id = workout_plan_id and student_id = auth.uid()
    )
  );

create policy "instructors_view_plan_exercises"
  on public.exercises for select
  using (
    exists (
      select 1 from public.workout_plans
      where id = workout_plan_id and instructor_id = auth.uid()
    )
  );

create policy "instructors_insert_exercises"
  on public.exercises for insert
  with check (
    exists (
      select 1 from public.workout_plans
      where id = workout_plan_id and instructor_id = auth.uid()
    )
  );

create policy "instructors_update_exercises"
  on public.exercises for update
  using (
    exists (
      select 1 from public.workout_plans
      where id = workout_plan_id and instructor_id = auth.uid()
    )
  );

create policy "instructors_delete_exercises"
  on public.exercises for delete
  using (
    exists (
      select 1 from public.workout_plans
      where id = workout_plan_id and instructor_id = auth.uid()
    )
  );
