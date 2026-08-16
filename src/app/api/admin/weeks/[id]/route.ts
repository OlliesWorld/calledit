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
  const { starts_at, locks_at } = await req.json()

  const update: { starts_at?: string; locks_at?: string } = {}
  if (starts_at) update.starts_at = new Date(starts_at).toISOString()
  if (locks_at) update.locks_at = new Date(locks_at).toISOString()

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase.from('weeks').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
