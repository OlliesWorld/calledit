import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { generateQuestions } from '@/lib/questions/generate'
import { createAdminClient } from '@/lib/supabase/admin'

const DATE = /^\d{4}-\d{2}-\d{2}$/

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json().catch(() => null)
  const startDate = body?.startDate
  const endDate = body?.endDate

  if (typeof startDate !== 'string' || typeof endDate !== 'string' || !DATE.test(startDate) || !DATE.test(endDate)) {
    return NextResponse.json({ error: 'startDate and endDate are required (YYYY-MM-DD)' }, { status: 400 })
  }

  // Each run is a paid model call and inserts six rows; never stack a second set
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })
  const { count } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('week_id', id)
  if (count && count > 0) {
    return NextResponse.json({ error: 'This week already has questions' }, { status: 409 })
  }

  try {
    const count = await generateQuestions(id, startDate, endDate)
    return NextResponse.json({ generated: count })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[generate questions]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
