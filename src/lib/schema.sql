-- 🔥 DROP TABLES IN DEPENDENCY ORDER
DROP VIEW IF EXISTS user_roadmap_progress;
DROP TABLE IF EXISTS user_exercise_progress;
DROP TABLE IF EXISTS node_exercises;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS roadmap_edges;
DROP TABLE IF EXISTS roadmap_nodes;
DROP TABLE IF EXISTS roadmaps;
DROP TABLE IF EXISTS users;

-- 👤 USERS
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 🗺️ ROADMAPS
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 🧠 NODES
CREATE TABLE roadmap_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  position_x INT,
  position_y INT
);

-- 🔗 EDGES
CREATE TABLE roadmap_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  source_node_id UUID REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
  target_node_id UUID REFERENCES roadmap_nodes(id) ON DELETE CASCADE
);

-- 🧮 EXERCISES
CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  difficulty TEXT,
  hints TEXT,
  solution TEXT,
  video_url TEXT,
  description TEXT,
  question_image_url TEXT,
  type TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 🔗 NODE_EXERCISES
CREATE TABLE node_exercises (
  node_id UUID REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INT,
  PRIMARY KEY (node_id, exercise_id)
);

-- ✅ USER EXERCISE PROGRESS
CREATE TABLE user_exercise_progress (
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, exercise_id)
);

-- 📈 VIEW: USER ROADMAP PROGRESS
CREATE VIEW user_roadmap_progress AS
SELECT
  r.id AS roadmap_id,
  u.id AS user_id,
  COUNT(DISTINCT ne.exercise_id) AS total_exercises,
  COUNT(DISTINCT uep.exercise_id) FILTER (WHERE uep.completed) AS completed_exercises,
  ROUND(
    100.0 * COUNT(DISTINCT uep.exercise_id) FILTER (WHERE uep.completed)::float
    / NULLIF(COUNT(DISTINCT ne.exercise_id), 0),
    2
  ) AS progress_percent,
  r.title AS roadmap_title,
  r.description AS roadmap_description,
  r.image_url AS roadmap_image_url,
  r.category AS roadmap_category
FROM users u
JOIN roadmaps r ON TRUE
JOIN roadmap_nodes rn ON rn.roadmap_id = r.id
JOIN node_exercises ne ON ne.node_id = rn.id
LEFT JOIN user_exercise_progress uep
  ON uep.exercise_id = ne.exercise_id AND uep.user_id = u.id
GROUP BY r.id, u.id;
