-- Add a league to weeks. Additive only: no renames, no drops.
-- Existing rows are backfilled to 'wnba' by the column default.
-- Questions and picks inherit their league through week_id.

ALTER TABLE weeks
    ADD COLUMN league TEXT NOT NULL DEFAULT 'wnba';

-- Known leagues. Keep in sync with LEAGUES in src/lib/leagues.ts.
ALTER TABLE weeks
    ADD CONSTRAINT weeks_league_check CHECK (league IN ('wnba', 'unrivaled'));

CREATE INDEX weeks_league_status_idx ON weeks (league, status);
