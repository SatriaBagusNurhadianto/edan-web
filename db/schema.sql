-- db/schema.sql
CREATE TABLE IF NOT EXISTS scholarships (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  level TEXT,
  category TEXT,
  summary TEXT,
  benefit TEXT,
  deadline_status TEXT,
  deadline_label TEXT,
  deadline_detail TEXT,
  requirements JSONB,
  official_url TEXT,
  sources JSONB,
  open_type TEXT,
  verified_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  scholarship_id TEXT REFERENCES scholarships(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, scholarship_id)
);

CREATE TABLE IF NOT EXISTS mentors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
