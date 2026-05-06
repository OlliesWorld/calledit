/**
 * AI Output Content Filtering
 * Prevents leakage of sensitive information in AI responses
 */

// Patterns that match potentially sensitive data
const SENSITIVE_PATTERNS: Record<string, RegExp> = {
  // Credentials and keys
  password: /password[:\s]*['\"]?[\w!@#$%^&*]+/gi,
  apiKey: /api[_\s]?key[:\s]*['\"]?[\w-]+/gi,
  token: /token[:\s]*['\"]?[\w.-]+/gi,
  secret: /secret[:\s]*['\"]?[\w-]+/gi,

  // Personal information
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,

  // Technical details that shouldn't leak
  ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  privateKey: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/gi,
}

/**
 * Filter sensitive content from AI output
 */
export function filterSensitiveContent(text: string): string {
  let filtered = text

  // Replace each pattern with redacted marker
  for (const [type, pattern] of Object.entries(SENSITIVE_PATTERNS)) {
    filtered = filtered.replace(pattern, `[REDACTED_${type.toUpperCase()}]`)
  }

  return filtered
}

/**
 * Check if content contains code that might be dangerous
 */
export function containsDangerousCode(text: string): boolean {
  const dangerousCodePatterns = [
    /rm\s+-rf/i,
    /eval\s*\(/i,
    /exec\s*\(/i,
    /<script[\s>]/i,
    /DROP\s+TABLE/i,
    /DELETE\s+FROM/i,
  ]

  return dangerousCodePatterns.some((pattern) => pattern.test(text))
}

/**
 * Validate AI response before returning to user
 */
export function validateAIResponse(text: string): {
  isValid: boolean
  reason?: string
  filteredText: string
} {
  // Filter sensitive content first
  const filteredText = filterSensitiveContent(text)

  // Check for dangerous code
  if (containsDangerousCode(filteredText)) {
    return {
      isValid: false,
      reason: 'Response contains potentially dangerous code',
      filteredText:
        'I apologize, but I cannot provide that information. Please rephrase your question.',
    }
  }

  // Check for excessive length (token exhaustion attack)
  if (filteredText.length > 10000) {
    return {
      isValid: false,
      reason: 'Response too long',
      filteredText:
        filteredText.substring(0, 10000) +
        '...\n\n[Response truncated for safety]',
    }
  }

  return {
    isValid: true,
    filteredText,
  }
}
