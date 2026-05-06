CREATE TABLE picks (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           TEXT NOT NULL,
    question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    week_id           UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    answer            BOOLEAN,
    tiebreaker_guess  NUMERIC,
    is_correct        BOOLEAN,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- user_id: Clerk user ID (e.g. "user_2abc...")
-- answer: true=yes, false=no; for 'pick' questions
-- tiebreaker_guess: numeric guess; for 'tiebreaker' questions
-- is_correct: null until week is scored
-- week_id is denormalized from question for leaderboard query efficiency

ALTER TABLE picks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "picks_select_own" ON picks
    FOR SELECT USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "picks_insert_own" ON picks
    FOR INSERT WITH CHECK (user_id = auth.jwt()->>'sub');

CREATE POLICY "picks_update_own" ON picks
    FOR UPDATE USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "picks_service_role" ON picks
    USING (auth.role() = 'service_role');
