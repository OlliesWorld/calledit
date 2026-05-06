import type { AIModel, AIProvider } from '@/types/ai'

/**
 * AI configuration - available models and default settings
 */

// Available models organized by provider
export const aiModels: AIModel[] = [
  // OpenAI models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Most capable OpenAI model, great for complex tasks',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'Fast and affordable for simpler tasks',
  },
  // Anthropic models
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    description: 'Excellent for coding and analysis',
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    description: 'Fast and efficient for quick tasks',
  },
  // Google models
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    description: 'Fast multimodal model from Google',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    description: 'Advanced reasoning with long context',
  },
] as const

// Default model to use
export const defaultModelId = 'gpt-4o-mini'

// Get model by ID
export function getModelById(id: string): AIModel | undefined {
  return aiModels.find((model) => model.id === id)
}

// Get models by provider
export function getModelsByProvider(provider: AIProvider): AIModel[] {
  return aiModels.filter((model) => model.provider === provider)
}

// Get all available model IDs
export function getModelIds(): string[] {
  return aiModels.map((model) => model.id)
}
