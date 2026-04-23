CREATE TABLE IF NOT EXISTS image_history (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  kol_filename        TEXT,
  product_filename    TEXT,
  pose_prompt         TEXT,
  motion_prompt       TEXT,
  continuation_prompt TEXT
);

CREATE TABLE IF NOT EXISTS video_history (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  video_filename   TEXT,
  segment_duration INTEGER
);

CREATE TABLE IF NOT EXISTS video_segments (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  history_id    INTEGER REFERENCES video_history(id) ON DELETE CASCADE,
  segment_index INTEGER,
  start_time    REAL,
  end_time      REAL,
  motion_prompt TEXT
);
