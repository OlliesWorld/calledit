import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/admin'
import { generateQuestions } from '@/lib/questions/generate'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { startDate, endDate } = body

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'startDate and endDate are required (YYYY-MM-DD)' }, { status: 400 })
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
