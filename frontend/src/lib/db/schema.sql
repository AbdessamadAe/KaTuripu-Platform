-- USERS
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  xp BIGINT DEFAULT 0,
  completedExercises TEXT  -- Optional: denormalized quick list
);

-- ROADMAPS
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT
);

-- ROADMAP NODES
CREATE TABLE roadmap_nodes (
  id UUID PRIMARY KEY,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  label TEXT,
  description TEXT,
  position_x INT,
  position_y INT
);

-- ROADMAP EDGES
CREATE TABLE roadmap_edges (
  id UUID PRIMARY KEY,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES roadmap_nodes(id) ON DELETE CASCADE
);

-- EXERCISES
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  difficulty TEXT,
  hints TEXT,
  solution TEXT,
  video_url TEXT,
  description TEXT
);

-- NODE EXERCISES (many-to-many between nodes and exercises)
CREATE TABLE node_exercises (
  node_id UUID REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  PRIMARY KEY (node_id, exercise_id)
);

-- ✅ USER COMPLETED EXERCISES
CREATE TABLE user_completed_exercises (
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, exercise_id)
);

-- ✅ USER NODE PROGRESS
CREATE TABLE user_node_progress (
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  node_id UUID REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
  total_exercises INT NOT NULL DEFAULT 0,
  completed_exercises INT NOT NULL DEFAULT 0,
  progress_percent REAL GENERATED ALWAYS AS (
    (completed_exercises::REAL / NULLIF(total_exercises, 0)) * 100
  ) STORED,
  last_updated TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, node_id)
);

-- ✅ USER ROADMAP PROGRESS
CREATE TABLE user_roadmap_progress (
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  total_exercises INT NOT NULL DEFAULT 0,
  completed_exercises INT NOT NULL DEFAULT 0,
  progress_percent REAL GENERATED ALWAYS AS (
    (completed_exercises::REAL / NULLIF(total_exercises, 0)) * 100
  ) STORED,
  last_updated TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, roadmap_id)
);
