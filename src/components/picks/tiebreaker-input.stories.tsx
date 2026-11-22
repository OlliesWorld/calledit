import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TiebreakerInput } from './tiebreaker-input'
import type { Question, Pick } from '@/types/calledit'

const question: Question = {
  id: 'q9',
  week_id: 'w1',
  question_text: 'How many total points will be scored in the Liberty game?',
  flavor_text: 'Closest without going over wins the tie.',
  question_type: 'tiebreaker',
  correct_answer: null,
  tiebreaker_answer: 171,
  display_order: 9,
  player_name: null,
  game_id: null,
  created_at: null,
}

const guess = (n: number): Pick => ({
  id: 'p9',
  user_id: 'u1',
  question_id: 'q9',
  week_id: 'w1',
  answer: null,
  tiebreaker_guess: n,
  is_correct: null,
  created_at: null,
  updated_at: null,
})

const meta = {
  title: 'Picks/TiebreakerInput',
  component: TiebreakerInput,
  args: { question, pick: undefined, weekStatus: 'open', index: 0, onChange: () => {} },
  decorators: [(Story) => <div className="w-[360px]"><Story /></div>],
} satisfies Meta<typeof TiebreakerInput>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {}
export const WithGuess: Story = { args: { pick: guess(168) } }
export const Locked: Story = { args: { weekStatus: 'locked', pick: guess(168) } }
export const ScoredWithAnswer: Story = { args: { weekStatus: 'scored', pick: guess(168) } }
