import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

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

export async function GET() {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .order('week_number', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
