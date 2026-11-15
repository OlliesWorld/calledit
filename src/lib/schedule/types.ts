// Shared shape for a scheduled game, whichever source it comes from.
// This is the former EspnGame shape; tipoff is nullable because some sources
// (hand-entered schedules) know the date before the tip time.
export interface Game {
  id: string
  /** YYYY-MM-DD */
  date: string
  homeTeam: string
  awayTeam: string
  /** ISO timestamp, or null when the tip time isn't known yet. */
  tipoff: string | null
}

export interface ScheduleSource {
  /** Games between startDate and endDate, both inclusive, as YYYY-MM-DD. */
  getGames(startDate: string, endDate: string): Promise<Game[]>
}
