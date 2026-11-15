import 'server-only'
import type { League } from '@/lib/leagues'
import { espnSource } from './espn'
import { unrivaledJsonSource } from './json'
import type { ScheduleSource } from './types'

export type { Game, ScheduleSource } from './types'

/**
 * Picks where a league's schedule comes from. Everything downstream (question
 * generation) only sees the ScheduleSource interface.
 */
export function getScheduleSource(league: League): ScheduleSource {
  switch (league) {
    case 'wnba':
      return espnSource
    case 'unrivaled':
      // Unrivaled's official data comes from Sportradar's paid API. When a key
      // is available, add `sportradarSource` in ./sportradar.ts implementing
      // ScheduleSource and return it here (e.g. when SPORTRADAR_API_KEY is
      // set), keeping the JSON file as the fallback.
      return unrivaledJsonSource
  }
}
