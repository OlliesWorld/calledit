import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_TRANSITIONS: Record<string, string> = {
  upcoming: 'open',
  open: 'locked',
  locked: 'scored',
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  const { id } = await params
  const { status } = await req.json()

  const { data: week } = await supabase.from('weeks').select('status').eq('id', id).single()
  if (!week) return NextResponse.json({ error: 'Week not found' }, { status: 404 })

  if (VALID_TRANSITIONS[week.status] !== status) {
    return NextResponse.json({ error: `Cannot transition from ${week.status} to ${status}` }, { status: 400 })
  }

  const update: { status: string; scored_at?: string } = { status }
  if (status === 'scored') update.scored_at = new Date().toISOString()

  const { data, error } = await supabase.from('weeks').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
