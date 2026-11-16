import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  const { id } = await params

  const { data: week, error: weekError } = await supabase
    .from('weeks')
    .select('*')
    .eq('id', id)
    .single()

  if (weekError || !week) return NextResponse.json({ error: 'Week not found' }, { status: 404 })

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('week_id', id)
    .order('display_order', { ascending: true })

  return NextResponse.json({ ...week, questions: questions ?? [] })
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
  const body = await req.json().catch(() => null)
  const { starts_at, locks_at } = body ?? {}

  const update: { starts_at?: string; locks_at?: string } = {}
  for (const [key, value] of [['starts_at', starts_at], ['locks_at', locks_at]] as const) {
    if (!value) continue
    const ms = typeof value === 'string' ? Date.parse(value) : NaN
    if (Number.isNaN(ms)) return NextResponse.json({ error: `${key} must be a valid date` }, { status: 400 })
    update[key] = new Date(ms).toISOString()
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase.from('weeks').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
