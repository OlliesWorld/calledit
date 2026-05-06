CREATE TABLE weeks (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_number  INTEGER NOT NULL,
    title        TEXT NOT NULL,
    starts_at    TIMESTAMPTZ NOT NULL,
    locks_at     TIMESTAMPTZ NOT NULL,
    scored_at    TIMESTAMPTZ,
    status       TEXT NOT NULL DEFAULT 'upcoming',
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- status values: 'upcoming' | 'open' | 'locked' | 'scored'

ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weeks_select" ON weeks
    FOR SELECT USING (true);

CREATE POLICY "weeks_service_role" ON weeks
    USING (auth.role() = 'service_role');
