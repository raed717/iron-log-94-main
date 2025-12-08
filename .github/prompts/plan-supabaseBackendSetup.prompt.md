# Supabase Backend Setup Plan for Iron-Log Fitness Tracker

## Overview
Set up complete **multi-user** backend database schema for the Iron-Log fitness tracking application with user authentication, 5 core tables (including users table), establish relationships, populate exercises data, and create signin/signup pages.

---

## Step 0: Create `users` Profile Table

**Purpose:** Store user profile information (extends Supabase Auth users)

**SQL Definition:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

**Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Primary Key, references auth.users(id) |
| email | TEXT | Yes | User email (unique) |
| username | TEXT | Yes | Display username (unique) |
| full_name | TEXT | No | User's full name |
| avatar_url | TEXT | No | Profile picture URL |
| created_at | TIMESTAMP | System | Account creation timestamp |
| updated_at | TIMESTAMP | System | Last profile update |

**Notes:**
- Supabase Auth handles email/password storage securely
- This table extends auth.users with profile data
- CASCADE delete removes all user data if account is deleted

---

## Step 1: Create `exercises` Table

**Purpose:** Master list of all exercises available in the system

**SQL Definition:**
```sql
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio')),
  muscle_group TEXT NOT NULL,
  equipment TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | TEXT | Yes | Primary Key (slug format: "bench-press") |
| name | TEXT | Yes | Display name ("Bench Press") |
| category | ENUM/TEXT | Yes | Values: chest, back, shoulders, arms, legs, core, cardio |
| muscle_group | TEXT | Yes | Specific muscle targeted ("Chest", "Upper Chest", "Lats", etc.) |
| equipment | TEXT | Yes | Equipment needed ("Barbell", "Dumbbells", "Cable Machine", "Machine", "Bodyweight", "EZ Bar") |
| description | TEXT | No | Optional description of the exercise |
| created_at | TIMESTAMP | System | Audit trail |
| updated_at | TIMESTAMP | System | Audit trail |

**Total Exercises to Insert:** 29
- Chest: 5 exercises
- Back: 5 exercises
- Shoulders: 5 exercises
- Arms: 5 exercises
- Legs: 6 exercises
- Core: 3 exercises

---

## Step 2: Create `workout_sessions` Table

**Purpose:** Groups individual exercise logs into complete workout sessions

**SQL Definition:**
```sql
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_name TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(user_id, session_date);
```

**Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Primary Key |
| user_id | UUID | Yes | Foreign Key → users.id |
| session_date | DATE | Yes | Session date (ISO format YYYY-MM-DD) |
| session_name | TEXT | No | Session name (e.g., "Chest Day", "Leg Day") |
| duration_minutes | INTEGER | No | Duration in minutes |
| created_at | TIMESTAMP | System | Timestamp |
| updated_at | TIMESTAMP | System | Timestamp |

**Relationships:**
- Foreign Key to `users` table (one user can have many sessions)
- One-to-Many with `workout_logs` (one session can contain multiple exercises)

---

## Step 3: Create `workout_logs` Table

**Purpose:** Individual exercise logging entries, links exercises to specific workout sessions

**SQL Definition:**
```sql
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_logs_user ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_exercise ON workout_logs(exercise_id);
CREATE INDEX idx_workout_logs_session ON workout_logs(workout_session_id);
```

**Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Primary Key |
| user_id | UUID | Yes | Foreign Key → users.id |
| exercise_id | TEXT | Yes | Foreign Key → exercises.id |
| workout_session_id | UUID | Yes | Foreign Key → workout_sessions.id |
| notes | TEXT | No | Optional notes about this exercise |
| created_at | TIMESTAMP | System | Timestamp |
| updated_at | TIMESTAMP | System | Timestamp |

**Relationships:**
- Foreign Key to `users` table (user who logged the exercise)
- Foreign Key to `exercises` table
- Foreign Key to `workout_sessions` table
- One-to-Many with `workout_sets` (one log can have multiple sets)

---

## Step 4: Create `workout_sets` Table

**Purpose:** Individual set data for each exercise in a workout log

**SQL Definition:**
```sql
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_log_id UUID NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  weight DECIMAL(8, 2) NOT NULL,
  reps INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_sets_user ON workout_sets(user_id);
CREATE INDEX idx_workout_sets_log ON workout_sets(workout_log_id);
CREATE INDEX idx_workout_sets_composite ON workout_sets(workout_log_id, set_number);
```

**Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | Yes | Primary Key |
| user_id | UUID | Yes | Foreign Key → users.id |
| workout_log_id | UUID | Yes | Foreign Key → workout_logs.id |
| set_number | INTEGER | Yes | Sequential set number (1, 2, 3...) |
| weight | DECIMAL(8,2) | Yes | Weight lifted (in kg) |
| reps | INTEGER | Yes | Number of repetitions |
| is_completed | BOOLEAN | Yes | Whether the set was completed |
| created_at | TIMESTAMP | System | Timestamp |

**Relationships:**
- Many-to-One with `workout_logs`
- Indexed by (workout_log_id, set_number) for efficient queries

---

## Step 5: Populate Exercises Table

**Data Source:** 29 exercises from `src/data/exercises.ts`

**Categories & Breakdown:**

### Chest (5)
1. bench-press | Bench Press | chest | Chest | Barbell | Classic compound movement for chest development
2. incline-bench | Incline Bench Press | chest | Upper Chest | Barbell | Targets upper chest fibers
3. dumbbell-fly | Dumbbell Fly | chest | Chest | Dumbbells | Isolation movement for chest stretch and contraction
4. cable-crossover | Cable Crossover | chest | Chest | Cable Machine | Constant tension chest isolation
5. chest-press-machine | Chest Press Machine | chest | Chest | Machine | Machine-assisted chest press

### Back (5)
6. deadlift | Deadlift | back | Back | Barbell | King of all exercises - full posterior chain
7. lat-pulldown | Lat Pulldown | back | Lats | Cable Machine | Vertical pull for lat development
8. barbell-row | Barbell Row | back | Back | Barbell | Horizontal pull for back thickness
9. cable-row | Seated Cable Row | back | Back | Cable Machine | Controlled horizontal pull
10. pull-up | Pull-Up | back | Lats | Bodyweight | Bodyweight vertical pull

### Shoulders (5)
11. overhead-press | Overhead Press | shoulders | Shoulders | Barbell | Compound shoulder movement
12. lateral-raise | Lateral Raise | shoulders | Side Delts | Dumbbells | Isolation for lateral deltoids
13. front-raise | Front Raise | shoulders | Front Delts | Dumbbells | Isolation for anterior deltoids
14. face-pull | Face Pull | shoulders | Rear Delts | Cable Machine | Rear delt and rotator cuff work
15. shoulder-press-machine | Shoulder Press Machine | shoulders | Shoulders | Machine | Machine-assisted shoulder press

### Arms (5)
16. barbell-curl | Barbell Curl | arms | Biceps | Barbell | Classic bicep builder
17. tricep-pushdown | Tricep Pushdown | arms | Triceps | Cable Machine | Tricep isolation with cable
18. hammer-curl | Hammer Curl | arms | Biceps | Dumbbells | Targets brachialis and biceps
19. skull-crusher | Skull Crusher | arms | Triceps | EZ Bar | Lying tricep extension
20. preacher-curl | Preacher Curl | arms | Biceps | Machine | Isolated bicep curl

### Legs (6)
21. squat | Squat | legs | Quads | Barbell | King of leg exercises
22. leg-press | Leg Press | legs | Quads | Machine | Machine compound leg movement
23. leg-curl | Leg Curl | legs | Hamstrings | Machine | Hamstring isolation
24. leg-extension | Leg Extension | legs | Quads | Machine | Quad isolation
25. calf-raise | Calf Raise | legs | Calves | Machine | Calf development
26. romanian-deadlift | Romanian Deadlift | legs | Hamstrings | Barbell | Hamstring and glute focus

### Core (3)
27. cable-crunch | Cable Crunch | core | Abs | Cable Machine | Weighted ab exercise
28. hanging-leg-raise | Hanging Leg Raise | core | Abs | Bodyweight | Lower ab focus
29. plank | Plank | core | Core | Bodyweight | Core stability

**Insert SQL:**
```sql
INSERT INTO exercises (id, name, category, muscle_group, equipment, description) VALUES
('bench-press', 'Bench Press', 'chest', 'Chest', 'Barbell', 'Classic compound movement for chest development'),
('incline-bench', 'Incline Bench Press', 'chest', 'Upper Chest', 'Barbell', 'Targets upper chest fibers'),
('dumbbell-fly', 'Dumbbell Fly', 'chest', 'Chest', 'Dumbbells', 'Isolation movement for chest stretch and contraction'),
('cable-crossover', 'Cable Crossover', 'chest', 'Chest', 'Cable Machine', 'Constant tension chest isolation'),
('chest-press-machine', 'Chest Press Machine', 'chest', 'Chest', 'Machine', 'Machine-assisted chest press'),
('deadlift', 'Deadlift', 'back', 'Back', 'Barbell', 'King of all exercises - full posterior chain'),
('lat-pulldown', 'Lat Pulldown', 'back', 'Lats', 'Cable Machine', 'Vertical pull for lat development'),
('barbell-row', 'Barbell Row', 'back', 'Back', 'Barbell', 'Horizontal pull for back thickness'),
('cable-row', 'Seated Cable Row', 'back', 'Back', 'Cable Machine', 'Controlled horizontal pull'),
('pull-up', 'Pull-Up', 'back', 'Lats', 'Bodyweight', 'Bodyweight vertical pull'),
('overhead-press', 'Overhead Press', 'shoulders', 'Shoulders', 'Barbell', 'Compound shoulder movement'),
('lateral-raise', 'Lateral Raise', 'shoulders', 'Side Delts', 'Dumbbells', 'Isolation for lateral deltoids'),
('front-raise', 'Front Raise', 'shoulders', 'Front Delts', 'Dumbbells', 'Isolation for anterior deltoids'),
('face-pull', 'Face Pull', 'shoulders', 'Rear Delts', 'Cable Machine', 'Rear delt and rotator cuff work'),
('shoulder-press-machine', 'Shoulder Press Machine', 'shoulders', 'Shoulders', 'Machine', 'Machine-assisted shoulder press'),
('barbell-curl', 'Barbell Curl', 'arms', 'Biceps', 'Barbell', 'Classic bicep builder'),
('tricep-pushdown', 'Tricep Pushdown', 'arms', 'Triceps', 'Cable Machine', 'Tricep isolation with cable'),
('hammer-curl', 'Hammer Curl', 'arms', 'Biceps', 'Dumbbells', 'Targets brachialis and biceps'),
('skull-crusher', 'Skull Crusher', 'arms', 'Triceps', 'EZ Bar', 'Lying tricep extension'),
('preacher-curl', 'Preacher Curl', 'arms', 'Biceps', 'Machine', 'Isolated bicep curl'),
('squat', 'Squat', 'legs', 'Quads', 'Barbell', 'King of leg exercises'),
('leg-press', 'Leg Press', 'legs', 'Quads', 'Machine', 'Machine compound leg movement'),
('leg-curl', 'Leg Curl', 'legs', 'Hamstrings', 'Machine', 'Hamstring isolation'),
('leg-extension', 'Leg Extension', 'legs', 'Quads', 'Machine', 'Quad isolation'),
('calf-raise', 'Calf Raise', 'legs', 'Calves', 'Machine', 'Calf development'),
('romanian-deadlift', 'Romanian Deadlift', 'legs', 'Hamstrings', 'Barbell', 'Hamstring and glute focus'),
('cable-crunch', 'Cable Crunch', 'core', 'Abs', 'Cable Machine', 'Weighted ab exercise'),
('hanging-leg-raise', 'Hanging Leg Raise', 'core', 'Abs', 'Bodyweight', 'Lower ab focus'),
('plank', 'Plank', 'core', 'Core', 'Bodyweight', 'Core stability');
```

---

## Step 6: Configure Row Level Security (RLS)

**Enable RLS on all user-data tables to enforce data isolation:**

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_sessions
CREATE POLICY "Users can view their own sessions"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON workout_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON workout_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for workout_logs (same pattern)
CREATE POLICY "Users can view their own logs"
  ON workout_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON workout_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON workout_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON workout_logs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for workout_sets (same pattern)
CREATE POLICY "Users can view their own sets"
  ON workout_sets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sets"
  ON workout_sets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sets"
  ON workout_sets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sets"
  ON workout_sets FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow public read access to exercises (no RLS needed)
-- Exercises are global reference data
```

**Key Points:**
- All user workout data tables enforce user isolation via RLS
- `exercises` table is public read-only (global reference data, no RLS needed)
- Users can only CRUD their own data via `auth.uid()` checks
- Database enforces security at row level, not just application level

---

## Data Model Relationships

```
USERS (Auth.users extension)
    ├─ 1:N → WORKOUT_SESSIONS
    ├─ 1:N → WORKOUT_LOGS
    └─ 1:N → WORKOUT_SETS

EXERCISES (Master Reference Table - Public)
    ↓ (is exercised by)
    WORKOUT_LOGS (Exercise instances per session)
        ├─ FK: user_id → users.id
        ├─ FK: exercise_id → exercises.id
        ├─ FK: workout_session_id → workout_sessions.id
        └─ (is broken down into)
            ↓
        WORKOUT_SETS (Individual sets)
            ├─ FK: user_id → users.id
            └─ FK: workout_log_id → workout_logs.id

WORKOUT_SESSIONS (Session grouping)
    ├─ FK: user_id → users.id
    └─ 1:N → WORKOUT_LOGS
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Total Tables Created** | 5 (users, exercises, workout_sessions, workout_logs, workout_sets) |
| **Total Exercises Inserted** | 29 |
| **Authentication** | Supabase Auth (email/password) + users profile table |
| **Primary Key Strategy** | TEXT for exercises (slug-based), UUID for others |
| **Relationships** | Foreign keys with CASCADE delete for data integrity; all user tables FK to users.id |
| **Indexes** | user_id, date, exercise_id, session_id, composite (log_id, set_number) for query optimization |
| **Data Types** | DECIMAL(8,2) for weights (not float for precision), DATE for sessions, TIMESTAMP for audits |
| **RLS Configuration** | **ENABLED** on all user data tables; users can only access their own data |
| **Data Isolation** | Database-level row-level security enforces multi-user data separation |

---

## Implementation Order

1. ✓ Create users profile table (extends auth.users)
2. ✓ Create exercises table
3. ✓ Create workout_sessions table (with user_id FK)
4. ✓ Create workout_logs table (with user_id FK)
5. ✓ Create workout_sets table (with user_id FK)
6. ✓ Insert 29 exercises into exercises table
7. ✓ Configure RLS policies on all user data tables
8. ✓ Create Auth trigger for user profile creation
9. ✓ Create Sign Up page (Auth registration form)
10. ✓ Create Sign In page (Auth login form)
11. ✓ Update App.tsx with auth state management

---

## Authentication Setup

### Auto-Create User Profile on Sign Up

Add a trigger to automatically create a user profile when someone signs up via Supabase Auth:

```sql
-- Create function to handle new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Frontend Pages to Create

### 1. **Sign Up Page** (`src/pages/SignUp.tsx`)

**Features:**
- Email input field
- Password input field (with strength indicator)
- Username input field
- Full name input (optional)
- "Sign Up" button
- Link to Sign In page
- Form validation (email format, password strength, unique username)
- Error handling (display auth errors from Supabase)
- Loading state during signup
- Success message / redirect to dashboard after signup

**Integration:**
- Use `supabase.auth.signUp()` to create account
- Handle `auth.users` and `users` profile table creation
- Redirect to Dashboard (Index page) on success

### 2. **Sign In Page** (`src/pages/SignIn.tsx`)

**Features:**
- Email input field
- Password input field
- "Sign In" button
- Link to Sign Up page
- "Forgot Password" link (optional, for future implementation)
- Form validation
- Error handling (invalid credentials)
- Loading state during signin
- Remember me checkbox (optional)
- Redirect to dashboard after signin

**Integration:**
- Use `supabase.auth.signInWithPassword()` to authenticate
- Set session in local storage / context
- Redirect to Dashboard (Index page) on success

### 3. **Protected Routes / Auth Context**

Add authentication state management:
- Create `src/context/AuthContext.tsx` to manage current user and auth state
- Wrap `<App/>` with `<AuthProvider>` in `main.tsx`
- Add route guards to redirect unauthenticated users to Sign In
- Add logout functionality in Header/Navbar

**Key Setup:**
```typescript
// Listen for auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    // Update auth context with session user
  }
);
```

---

## Database Functions (Optional but Recommended)

### Auto-increment user stats on set completion

```sql
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_workouts INTEGER DEFAULT 0,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to update stats when a set is completed
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats
  SET 
    total_sets = total_sets + 1,
    total_reps = total_reps + NEW.reps,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_set_created
  AFTER INSERT ON public.workout_sets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats();
```

---

## Next Steps After Setup

1. **Deploy database migrations:** Apply all SQL to Supabase
2. **Create Auth pages:** Sign Up & Sign In pages with form validation
3. **Set up Auth Context:** Manage user session state across app
4. **Create protected routes:** Redirect unauthenticated users to Sign In
5. **Connect CRUD operations:** Create hooks for workout logging, querying exercises, fetching progress
6. **Add user profile page:** Let users update email, username, full_name, avatar
7. **Implement session management:** Handle logout, auto-refresh tokens
8. **Create materialized views:** user_stats and exercise_stats for performance
9. **Set up real-time subscriptions:** For live progress updates during workouts
