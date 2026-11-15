export type WeekStatus = 'upcoming' | 'open' | 'locked' | 'scored'
export type QuestionType = 'pick' | 'tiebreaker'

export interface Week {
  id: string
  week_number: number
  title: string
  starts_at: string
  locks_at: string
  scored_at: string | null
  status: string
  // One of LEAGUES in src/lib/leagues.ts. Typed as string to match the DB row;
  // narrow with isLeague()/toLeague() where it matters.
  league: string
  created_at: string | null
  updated_at: string | null
}

export interface Question {
  id: string
  week_id: string
  question_text: string
  flavor_text: string | null
  question_type: string
  correct_answer: boolean | null
  tiebreaker_answer: number | null
  display_order: number
  player_name: string | null
  game_id: string | null
  created_at: string | null
}

export interface Pick {
  id: string
  user_id: string
  question_id: string
  week_id: string
  answer: boolean | null
  tiebreaker_guess: number | null
  is_correct: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface WeekWithQuestions extends Week {
  questions: Question[]
}

export interface PickWithQuestion extends Pick {
  question: Question
}
