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


-- Get FUll roadmap with progress
CREATE OR REPLACE FUNCTION get_full_roadmap_with_progress(
  p_user_id TEXT,
  p_roadmap_id UUID
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'roadmap', jsonb_build_object(
      'id', r.id,
      'title', r.title,
      'description', r.description,
      'slug', r.slug,
      'category', r.category,
      'image_url', r.image_url,
      'nodes', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', rn.id::TEXT, 
            'type', rn.type::TEXT,
            'data', jsonb_build_object(
              'label', rn.label,
              'description', rn.description,
              'progress', (
                SELECT COALESCE(ROUND(
                  100.0 * COUNT(DISTINCT uep.exercise_id) FILTER (WHERE uep.completed)::numeric
                  / NULLIF(COUNT(DISTINCT ne.exercise_id), 0),
                  2
                ), 0)
                FROM node_exercises ne
                LEFT JOIN user_exercise_progress uep
                  ON uep.exercise_id = ne.exercise_id AND uep.user_id = p_user_id
                WHERE ne.node_id = rn.id
              ),
              'total_exercises', (  -- New field with exercise count
                SELECT COUNT(*)
                FROM node_exercises ne
                JOIN exercises e ON e.id = ne.exercise_id AND e.is_active = true
                WHERE ne.node_id = rn.id
              )
            ),
            'position', jsonb_build_object(
              'x', COALESCE(rn.position_x, 0),
              'y', COALESCE(rn.position_y, 0)
            )
          ) ORDER BY rn.position_x, rn.position_y
        )
        FROM roadmap_nodes rn
        WHERE rn.roadmap_id = p_roadmap_id
      ),
      'edges', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', re.id::TEXT,
            'source', re.source_node_id::TEXT,
            'target', re.target_node_id::TEXT
          )
        )
        FROM roadmap_edges re
        WHERE re.roadmap_id = p_roadmap_id
      )
    )
  )
  INTO result
  FROM roadmaps r
  WHERE r.id = p_roadmap_id;

  RETURN COALESCE(result, jsonb_build_object('roadmap', NULL));
END;
$$ LANGUAGE plpgsql;


--  Get exercise with status
CREATE OR REPLACE FUNCTION get_exercise_with_status(
  p_exercise_id UUID,
  p_user_id TEXT
) RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT 
    jsonb_strip_nulls(
      to_jsonb(e) || 
      jsonb_build_object(
        'completed', COALESCE(uep.completed, false),
        'completed_at', uep.completed_at
      )
    )
  INTO result
  FROM exercises e
  LEFT JOIN user_exercise_progress uep ON 
    uep.exercise_id = e.id AND 
    uep.user_id = p_user_id
  WHERE e.id = p_exercise_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;



-- Get meta for exercises list with status, of a node
CREATE OR REPLACE FUNCTION get_node_exercises_with_status(
  p_user_id TEXT,
  p_node_id UUID
) RETURNS jsonb AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', e.id,
        'order_index', ne.order_index,
        'name', e.name,
        'type', e.type,
        'difficulty', e.difficulty,
        'completed', COALESCE(uep.completed, false),
        'completed_at', uep.completed_at
      )
      ORDER BY ne.order_index  -- Move ORDER BY inside jsonb_agg
    )
    FROM node_exercises ne
    JOIN exercises e ON e.id = ne.exercise_id
    LEFT JOIN user_exercise_progress uep ON 
      uep.exercise_id = ne.exercise_id AND 
      uep.user_id = p_user_id
    WHERE 
      ne.node_id = p_node_id AND
      e.is_active = true
  );
END;
$$ LANGUAGE plpgsql;