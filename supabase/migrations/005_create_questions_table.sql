CREATE TABLE questions (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id            UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    question_text      TEXT NOT NULL,
    flavor_text        TEXT,
    question_type      TEXT NOT NULL DEFAULT 'pick',
    correct_answer     BOOLEAN,
    tiebreaker_answer  NUMERIC,
    display_order      INTEGER NOT NULL DEFAULT 0,
    player_name        TEXT,
    game_id            TEXT,
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- question_type values: 'pick' | 'tiebreaker'
-- correct_answer: null until scored; only for 'pick' type
-- tiebreaker_answer: null until scored; only for 'tiebreaker' type

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions_select" ON questions
    FOR SELECT USING (true);

CREATE POLICY "questions_service_role" ON questions
    USING (auth.role() = 'service_role');
