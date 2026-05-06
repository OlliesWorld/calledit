'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { aiModels, defaultModelId } from '@/lib/ai'
import type { AIModel } from '@/types/ai'

interface ChatInterfaceProps {
  className?: string
}

// Helper to extract text content from message parts
function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return ''
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('')
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [selectedModel, setSelectedModel] = useState(defaultModelId)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Create transport with dynamic body that includes selected model
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ai/chat',
        body: { model: selectedModel },
      }),
    [selectedModel]
  )

  const { messages, sendMessage, status, error } = useChat({
    transport,
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Group models by provider for the selector
  const modelsByProvider = aiModels.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = []
      }
      acc[model.provider].push(model)
      return acc
    },
    {} as Record<string, AIModel[]>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput('')
    await sendMessage({ text: message })
  }

  return (
    <div className={cn('flex flex-col h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900', className)}>
      {/* Header with model selector */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Chat</h2>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
          disabled={isLoading}
        >
          {Object.entries(modelsByProvider).map(([provider, models]) => (
            <optgroup key={provider} label={provider.charAt(0).toUpperCase() + provider.slice(1)}>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Bot className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">Start a conversation with the AI</p>
          </div>
        )}

        {messages.map((message) => {
          const text = getMessageText(message)
          if (!text) return null

          return (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 max-w-[85%]',
                message.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                  message.role === 'user'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                )}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={cn(
                  'rounded-lg px-4 py-2 text-sm',
                  message.role === 'user'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                )}
              >
                <p className="whitespace-pre-wrap">{text}</p>
              </div>
            </div>
          )
        })}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            Error: {error.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
