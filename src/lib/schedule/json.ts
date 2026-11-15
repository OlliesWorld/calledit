import 'server-only'
import { z } from 'zod'
import type { Game, ScheduleSource } from './types'
// Imported statically (not read with fs) so the file is bundled into the
// serverless function on deploy.
import unrivaled2027 from '../../../data/unrivaled-2027.json'

const gameSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  tipoff: z.string().nullable(),
})

const fileSchema = z.object({
  games: z.array(gameSchema),
})

/**
 * A schedule source backed by a hand-maintained JSON file.
 * `date` in the file is the calendar date printed on the official schedule;
 * the range filter is inclusive on both ends.
 */
export function createJsonSource(file: unknown, label: string): ScheduleSource {
  return {
    async getGames(startDate, endDate) {
      const parsed = fileSchema.safeParse(file)
      if (!parsed.success) {
        const issue = parsed.error.issues[0]
        throw new Error(
          `Schedule file ${label} is invalid at ${issue.path.join('.') || '(root)'}: ${issue.message}`
        )
      }

      return parsed.data.games
        .filter((g) => g.date >= startDate && g.date <= endDate)
        .map((g): Game => ({
          id: g.id,
          date: g.date,
          homeTeam: g.homeTeam,
          awayTeam: g.awayTeam,
          tipoff: g.tipoff,
        }))
    },
  }
}

/** Unrivaled 2027 schedule, entered by hand from the official schedule. */
export const unrivaledJsonSource = createJsonSource(unrivaled2027, 'data/unrivaled-2027.json')
