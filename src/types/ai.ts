/**
 * AI-related type definitions
 */

// Supported AI providers
export type AIProvider = 'openai' | 'anthropic' | 'google'

// Message roles in a conversation
export type MessageRole = 'user' | 'assistant' | 'system'

// A single message in a conversation
export interface AIMessage {
  role: MessageRole
  content: string
}

// Model configuration
export interface AIModel {
  id: string
  name: string
  provider: AIProvider
  description?: string
}

// Chat request payload
export interface ChatRequest {
  messages: AIMessage[]
  model: string
}

// Provider configuration
export interface ProviderConfig {
  name: string
  models: AIModel[]
}
