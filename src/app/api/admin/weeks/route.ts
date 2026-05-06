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
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  const body = await req.json()
  const { week_number, title, starts_at, locks_at } = body

  if (!week_number || !title || !starts_at || !locks_at) {
    return NextResponse.json({ error: 'week_number, title, starts_at, locks_at are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('weeks')
    .insert({ week_number, title, starts_at, locks_at, status: 'upcoming' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
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
