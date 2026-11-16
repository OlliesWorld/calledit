import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PickError, submitPick } from '@/lib/picks/actions'
import { applyRateLimit, picksRateLimiter } from '@/lib/utils/rate-limit'

const pickSchema = z
  .object({
    questionId: z.uuid(),
    weekId: z.uuid(),
    answer: z.boolean().optional(),
    tiebreakerGuess: z.number().finite().min(0).max(100000).optional(),
  })
  .refine((v) => (v.answer === undefined) !== (v.tiebreakerGuess === undefined), {
    message: 'Send either answer or tiebreakerGuess',
  })

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = applyRateLimit(req, picksRateLimiter, userId)
  if (limited) return limited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = pickSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'questionId and weekId are required, with an answer or a tiebreakerGuess' }, { status: 400 })
  }

  try {
    const pick = await submitPick({ userId, ...parsed.data })
    return NextResponse.json(pick)
  } catch (err) {
    if (err instanceof PickError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    // Log the detail, return a generic message: database errors are not for players
    console.error('[POST /api/picks]', err)
    return NextResponse.json({ error: 'Could not save pick' }, { status: 500 })
  }
}
