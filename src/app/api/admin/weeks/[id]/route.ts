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
