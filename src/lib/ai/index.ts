import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { getModelById } from '@/config/ai'
import type { AIProvider } from '@/types/ai'

/**
 * AI provider initialization and model registry
 */

// Initialize providers (they read API keys from environment automatically)
const openai = createOpenAI({
  // Uses OPENAI_API_KEY env var by default
})

const anthropic = createAnthropic({
  // Uses ANTHROPIC_API_KEY env var by default
})

const google = createGoogleGenerativeAI({
  // Uses GOOGLE_GENERATIVE_AI_API_KEY env var by default
})

// Map providers to their SDK instances
const providerMap: Record<AIProvider, ReturnType<typeof createOpenAI> | ReturnType<typeof createAnthropic> | ReturnType<typeof createGoogleGenerativeAI>> = {
  openai,
  anthropic,
  google,
}

/**
 * Get the language model instance for a given model ID
 * Used with streamText() from the Vercel AI SDK
 */
export function getLanguageModel(modelId: string) {
  const modelConfig = getModelById(modelId)

  if (!modelConfig) {
    throw new Error(`Unknown model: ${modelId}`)
  }

  const provider = providerMap[modelConfig.provider]
  return provider(modelConfig.id)
}

// Re-export config utilities for convenience
export { getModelById, getModelsByProvider, getModelIds, aiModels, defaultModelId } from '@/config/ai'
