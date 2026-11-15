import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  const question_text = typeof body?.question_text === 'string' ? body.question_text.trim() : ''
  const flavor_text = typeof body?.flavor_text === 'string' ? body.flavor_text.trim() : ''
  if (!question_text || question_text.length > 500 || flavor_text.length > 1000) {
    return NextResponse.json({ error: 'question_text is required (max 500 chars); flavor_text max 1000' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('questions')
    .update({ question_text, flavor_text: flavor_text || null })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
