import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { getLanguageModel } from '@/lib/ai'
import { applyRateLimit, aiChatRateLimiter } from '@/lib/utils'
import { chatRequestSchema } from '@/lib/validations/ai'
import {
  sanitizeMessages,
  isSuspiciousMessage,
  getSecureSystemPrompt,
} from '@/lib/ai/sanitize'
import { filterSensitiveContent, containsDangerousCode } from '@/lib/ai/filter'

/**
 * Creates a TransformStream that filters sensitive content from AI responses
 * This works with the Vercel AI SDK's streaming format
 */
function createFilteringStream(): TransformStream<Uint8Array, Uint8Array> {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  const tailSize = 200
  let buffer = ''

  return new TransformStream({
    transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true })
      buffer += text

      // Filter sensitive content from the rolling buffer
      let filteredText = filterSensitiveContent(buffer)

      // Check for dangerous code patterns and redact if found
      if (containsDangerousCode(filteredText)) {
        filteredText = filteredText.replace(
          /(rm\s+-rf|eval\s*\(|exec\s*\(|<script[\s>]|DROP\s+TABLE|DELETE\s+FROM)/gi,
          '[BLOCKED_DANGEROUS_CONTENT]'
        )
      }

      if (filteredText.length > tailSize) {
        const emitText = filteredText.slice(0, filteredText.length - tailSize)
        buffer = filteredText.slice(filteredText.length - tailSize)
        controller.enqueue(encoder.encode(emitText))
      } else {
        buffer = filteredText
      }
    },
    flush(controller) {
      if (buffer.length > 0) {
        controller.enqueue(encoder.encode(buffer))
      }
      controller.terminate()
    }
  })
}

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const rateLimitResponse = applyRateLimit(req, aiChatRateLimiter)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    // 2. Authenticate user
    const { userId } = await auth()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 3. Parse and validate request
    const body = await req.json()
    const validation = chatRequestSchema.safeParse(body)

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request data',
          details: validation.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages, model: modelId } = validation.data

    // 4. Check for suspicious messages (prompt injection attempts)
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()

    if (lastUserMessage && isSuspiciousMessage(lastUserMessage.content)) {
      // Log suspicious activity
      console.warn('Suspicious message detected', {
        userId,
        messageLength: lastUserMessage.content.length,
        timestamp: new Date().toISOString(),
      })
    }

    // 5. Sanitize user messages
    const sanitizedMessages = sanitizeMessages(messages)

    // 6. Add security-hardened system prompt
    const systemPrompt = getSecureSystemPrompt()
    const allMessages = [systemPrompt, ...sanitizedMessages]

    // 7. Get the language model and stream the response
    const model = getLanguageModel(modelId)

    const result = streamText({
      model,
      messages: allMessages,
      maxOutputTokens: 2000, // Prevent excessive token usage
      temperature: 0.7, // Balanced creativity/consistency
    })

    // 8. Get the response and apply output filtering
    const response = result.toUIMessageStreamResponse()
    
    // 9. Pipe through filtering transform to redact sensitive content
    const filteredStream = response.body?.pipeThrough(createFilteringStream())
    
    if (!filteredStream) {
      return new Response(
        JSON.stringify({ error: 'Failed to create response stream' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 10. Return filtered streaming response (compatible with useChat hook)
    return new Response(filteredStream, {
      headers: response.headers,
    })
  } catch (err) {
    console.error('AI Chat Error:', err)

    // Handle specific error types
    if (err instanceof Error) {
      // Check for API key errors
      if (
        err.message.includes('API key') ||
        err.message.includes('authentication')
      ) {
        return new Response(
          JSON.stringify({ error: 'AI service configuration error' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
