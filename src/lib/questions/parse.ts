// Turns the model's raw reply into validated questions.
// Pure module (no server-only, no I/O).

import { z } from 'zod'

export const PICK_QUESTION_COUNT = 5

const optionalText = z
  .union([z.string(), z.number()])
  .nullish()
  .transform((v) => (v === null || v === undefined || v === '' ? null : String(v)))

const baseQuestion = {
  question_text: z.string().trim().min(1, 'question_text is empty'),
  flavor_text: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
  player_name: optionalText,
  game_id: optionalText,
}

const pickSchema = z.object({
  ...baseQuestion,
  question_type: z.literal('pick').default('pick'),
})

const tiebreakerSchema = z.object({
  ...baseQuestion,
  question_type: z.literal('tiebreaker').default('tiebreaker'),
})

const generatedSchema = z.object({
  questions: z
    .array(pickSchema)
    .length(PICK_QUESTION_COUNT, `expected exactly ${PICK_QUESTION_COUNT} pick questions`),
  tiebreaker: tiebreakerSchema,
})

export type GeneratedQuestion = z.infer<typeof pickSchema> | z.infer<typeof tiebreakerSchema>
export type GeneratedQuestions = z.infer<typeof generatedSchema>

/**
 * Pulls the JSON object out of a model reply that may be wrapped in a code
 * fence or surrounded by prose. Returns the parsed value, or throws.
 */
export function extractJson(raw: string): unknown {
  const text = raw.trim()

  const candidates: string[] = [text]

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced) candidates.push(fenced[1].trim())

  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first !== -1 && last > first) candidates.push(text.slice(first, last + 1))

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate)
    } catch {
      // try the next candidate
    }
  }

  throw new Error('Claude returned invalid JSON')
}

/** Parses and validates a model reply: exactly 5 picks and 1 tiebreaker. */
export function parseGeneratedQuestions(raw: string): GeneratedQuestions {
  const json = extractJson(raw)
  const result = generatedSchema.safeParse(json)

  if (!result.success) {
    const details = result.error.issues
      .slice(0, 3)
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ')
    throw new Error(`Claude returned questions in an unexpected shape (${details})`)
  }

  return result.data
}
