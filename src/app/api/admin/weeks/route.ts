import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_LEAGUE, isLeague } from '@/lib/leagues'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json(
      {
        error: 'Database unavailable: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
      },
      { status: 500 }
    )
  }

  let body: {
    week_number?: unknown
    title?: unknown
    starts_at?: unknown
    locks_at?: unknown
    league?: unknown
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const weekNumber = Number(body.week_number)
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const startsAt = typeof body.starts_at === 'string' ? body.starts_at : ''
  const locksAt = typeof body.locks_at === 'string' ? body.locks_at : ''

  // Omitted league means the default, so pre-league callers keep working
  const league = body.league === undefined || body.league === null ? DEFAULT_LEAGUE : body.league
  if (!isLeague(league)) {
    return NextResponse.json({ error: 'league must be a known league' }, { status: 400 })
  }

  if (!Number.isFinite(weekNumber) || weekNumber <= 0 || !title || !startsAt || !locksAt) {
    return NextResponse.json(
      {
        error: 'week_number (positive number), title, starts_at, locks_at are required',
      },
      { status: 400 }
    )
  }

  const startsMs = Date.parse(startsAt)
  const locksMs = Date.parse(locksAt)
  if (Number.isNaN(startsMs) || Number.isNaN(locksMs)) {
    return NextResponse.json({ error: 'starts_at and locks_at must be valid ISO dates' }, { status: 400 })
  }

  if (locksMs <= startsMs) {
    return NextResponse.json({ error: 'locks_at must be after starts_at' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('weeks')
    .insert({
      week_number: weekNumber,
      title,
      starts_at: new Date(startsMs).toISOString(),
      locks_at: new Date(locksMs).toISOString(),
      status: 'upcoming',
      league,
    })
    .select()
    .single()

  if (error) {
    console.error('[admin/weeks POST]', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return NextResponse.json(
      {
        error: `Failed to create week: ${error.message}`,
        code: error.code,
        hint: error.hint,
      },
      { status: 500 }
    )
  }

  return NextResponse.json(data, { status: 201 })
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  // Optional ?league= filter; no param returns every league
  const leagueParam = req.nextUrl.searchParams.get('league')
  if (leagueParam !== null && !isLeague(leagueParam)) {
    return NextResponse.json({ error: 'Unknown league' }, { status: 400 })
  }

  let query = supabase.from('weeks').select('*')
  if (leagueParam) query = query.eq('league', leagueParam)
  const { data, error } = await query.order('week_number', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
