import { z } from 'zod'
import { getModelIds } from '@/config/ai'

/**
 * AI-related validation schemas
 */

// Enhanced message schema with length limits
export const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(4000, 'Message is too long (maximum 4000 characters)'),
})

// Chat request schema with message count limit - validates incoming chat API requests
export const chatRequestSchema = z.object({
  messages: z
    .array(messageSchema)
    .min(1, 'At least one message is required')
    .max(50, 'Too many messages in conversation (maximum 50)'),
  model: z.string().refine(
    (val) => getModelIds().includes(val),
    { message: 'Invalid model selected' }
  ),
})

// Infer types from schemas
export type MessageInput = z.infer<typeof messageSchema>
export type ChatRequestInput = z.infer<typeof chatRequestSchema>
