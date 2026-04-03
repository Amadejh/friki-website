-- FRIKI WEBSITE — Supabase Schema
-- Run this in the Supabase SQL Editor after creating your project
-- Project: friki-website

-- ─── Events ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title             TEXT        NOT NULL,
  slug              TEXT        UNIQUE NOT NULL,
  description       TEXT,
  teaser            TEXT,
  date              TIMESTAMPTZ NOT NULL,
  time              TEXT,                     -- human-readable, e.g. "20:00"
  location          TEXT,
  organizer         TEXT        DEFAULT 'Friki',
  cover_image_url   TEXT,
  category          TEXT,                     -- Social, Tech, Community, Career, Sport, Gaming
  price_in_cents    INTEGER     NOT NULL DEFAULT 0,
  capacity          INTEGER,
  tickets_sold      INTEGER     NOT NULL DEFAULT 0,
  year              INTEGER     GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)::INTEGER) STORED,
  is_published      BOOLEAN     NOT NULL DEFAULT false,
  is_past           BOOLEAN     NOT NULL DEFAULT false,
  wide              BOOLEAN     NOT NULL DEFAULT false,  -- for grid layout (spans 2 cols)
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Tickets ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id          UUID        REFERENCES events(id) ON DELETE RESTRICT NOT NULL,
  buyer_name        TEXT        NOT NULL,
  buyer_email       TEXT        NOT NULL,
  stripe_session_id TEXT        UNIQUE NOT NULL,
  qr_code           TEXT,                     -- base64-encoded PNG, generated on webhook
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Gallery photos ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id          UUID        REFERENCES events(id) ON DELETE CASCADE,
  image_url         TEXT        NOT NULL,
  caption           TEXT,
  sort_order        INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS events_slug_idx ON events(slug);
CREATE INDEX IF NOT EXISTS events_published_past_idx ON events(is_published, is_past, date);
CREATE INDEX IF NOT EXISTS tickets_session_idx ON tickets(stripe_session_id);
CREATE INDEX IF NOT EXISTS tickets_event_idx ON tickets(event_id);
CREATE INDEX IF NOT EXISTS gallery_event_idx ON gallery_photos(event_id, sort_order);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Events: public can read published events only
CREATE POLICY "Published events are publicly readable"
  ON events FOR SELECT
  USING (is_published = true);

-- Tickets: NO public access — service role only (via supabase-server.ts)
-- No SELECT policy = no public reads. Service role bypasses RLS.

-- Gallery: public can read all photos
CREATE POLICY "Gallery photos are publicly readable"
  ON gallery_photos FOR SELECT
  USING (true);

-- ─── RPC Functions ────────────────────────────────────────────────────────────

-- Atomically increment tickets_sold — called by the webhook handler
CREATE OR REPLACE FUNCTION increment_tickets_sold(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE events
  SET tickets_sold = tickets_sold + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Sample data (remove before production) ──────────────────────────────────
-- INSERT INTO events (title, slug, teaser, description, date, time, location, category, price_in_cents, is_published)
-- VALUES (
--   'FRI Noč 2025',
--   'fri-noc-2025',
--   'The biggest annual night at FRI.',
--   'Full description here.',
--   '2025-04-18 20:00:00+02',
--   '20:00',
--   'FRI Ljubljana',
--   'Social',
--   500,
--   true
-- );
