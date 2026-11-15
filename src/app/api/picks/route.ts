import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { PickError, submitPick } from '@/lib/picks/actions'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { questionId, weekId, answer, tiebreakerGuess } = body

    if (!questionId || !weekId) {
      return NextResponse.json({ error: 'questionId and weekId are required' }, { status: 400 })
    }

    const pick = await submitPick({ userId, questionId, weekId, answer, tiebreakerGuess })
    return NextResponse.json(pick)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[POST /api/picks]', message, err)
    const status = err instanceof PickError ? err.status : 500
    return NextResponse.json({ error: message }, { status })
  }
}
