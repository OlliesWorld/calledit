import 'server-only'
import { cookies } from 'next/headers'
import { LEAGUE_COOKIE, toLeague, type League } from '@/lib/leagues'

/** The league the user last looked at, or the default if they have none. */
export async function getPreferredLeague(): Promise<League> {
  const store = await cookies()
  return toLeague(store.get(LEAGUE_COOKIE)?.value)
}
