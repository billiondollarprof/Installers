-- Draft D1 schema for the lead finder and Lead Desk. Review before applying.

CREATE TABLE IF NOT EXISTS leads (
  id              TEXT PRIMARY KEY,
  place_id        TEXT UNIQUE,            -- Google Places id, for dedupe and re-reading details
  company_no      TEXT UNIQUE,            -- Companies House number
  biz             TEXT NOT NULL,
  contact         TEXT,                   -- director or named contact
  trades          TEXT,                   -- comma separated: windows, doors, conservatories, roofline
  town            TEXT,
  region          TEXT,
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  company_type    TEXT,                   -- Ltd, LLP, Sole trader, Partnership
  incorporated    TEXT,                   -- YYYY-MM-DD
  reviews         INTEGER,
  rating          REAL,
  score           INTEGER,
  source          TEXT,                   -- finder, import, manual
  ctps            TEXT DEFAULT '',        -- '', clear, registered
  status          TEXT DEFAULT 'new',     -- new, called, interested, video, followup, pilot, won, no, dnc
  next_date       TEXT,                   -- YYYY-MM-DD
  last_contact    TEXT,
  notes           TEXT,
  created         TEXT NOT NULL,
  updated         TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS leads_next ON leads(next_date);
CREATE INDEX IF NOT EXISTS leads_region ON leads(region);

CREATE TABLE IF NOT EXISTS runs (
  id          TEXT PRIMARY KEY,
  started     TEXT NOT NULL,
  finished    TEXT,
  region      TEXT,
  searched    INTEGER DEFAULT 0,
  added       INTEGER DEFAULT 0,
  skipped     INTEGER DEFAULT 0,
  skip_notes  TEXT,                       -- JSON: reason -> count
  errors      TEXT
);
