import { z } from 'zod'

/**
 * Password complexity requirements
 */
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one symbol')

/**
 * Validates password meets complexity requirements
 * Returns error message or null if valid
 */
export function validatePassword(password: string): string | null {
  if (password.length < 12) {
    return 'Password must be at least 12 characters'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number'
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return 'Password must contain at least one symbol'
  }
  return null
}

/**
 * Email/password sign up validation
 */
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type SignUpInput = z.infer<typeof signUpSchema>

/**
 * Email/password sign in validation
 */
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SignInInput = z.infer<typeof signInSchema>
