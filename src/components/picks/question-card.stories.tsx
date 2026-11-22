import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QuestionCard } from './question-card'
import type { Question, Pick } from '@/types/calledit'

const question: Question = {
  id: 'q1',
  week_id: 'w1',
  question_text: 'Will the Aces score 90 or more points on Friday?',
  flavor_text: 'They hit 90 in four of their last five home games.',
  question_type: 'pick',
  correct_answer: true,
  tiebreaker_answer: null,
  display_order: 1,
  player_name: null,
  game_id: null,
  created_at: null,
}

const pick = (answer: boolean, is_correct: boolean | null = null): Pick => ({
  id: 'p1',
  user_id: 'u1',
  question_id: 'q1',
  week_id: 'w1',
  answer,
  tiebreaker_guess: null,
  is_correct,
  created_at: null,
  updated_at: null,
})

const meta = {
  title: 'Picks/QuestionCard',
  component: QuestionCard,
  args: { question, pick: undefined, weekStatus: 'open', index: 0, onPick: () => {} },
  decorators: [(Story) => <div className="w-[360px]"><Story /></div>],
} satisfies Meta<typeof QuestionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {}
export const YesSelected: Story = { args: { pick: pick(true) } }
export const NoSelected: Story = { args: { pick: pick(false) } }
export const NoFlavorText: Story = { args: { question: { ...question, flavor_text: null } } }
export const Locked: Story = { args: { weekStatus: 'locked', pick: pick(true) } }
export const ScoredCorrect: Story = { args: { weekStatus: 'scored', pick: pick(true, true) } }
export const ScoredWrong: Story = {
  args: { weekStatus: 'scored', pick: pick(false, false) },
}
