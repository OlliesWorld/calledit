import { z } from 'zod'

/**
 * Profile update validation
 */
export const profileUpdateSchema = z.object({
  full_name: z.string().max(255).optional().nullable(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional()
    .nullable(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable(),
  website: z.string().url('Invalid URL format').optional().nullable().or(z.literal('')),
  location: z.string().max(255).optional().nullable(),
  company: z.string().max(255).optional().nullable(),
  job_title: z.string().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  // Only the built-in generated avatars ("boring:<variant>"). Arbitrary image
  // URLs would be loaded by every viewer of the leaderboard.
  avatar_url: z
    .string()
    .regex(/^boring:(beam|marble|pixel|sunset|ring|bauhaus)$/, 'Unknown avatar')
    .optional()
    .nullable(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

/**
 * User preferences update validation
 */
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().max(10).optional(),
  timezone: z.string().max(100).optional(),
  email_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  marketing_emails: z.boolean().optional(),
  dashboard_layout: z.string().max(50).optional(),
  sidebar_collapsed: z.boolean().optional(),
})

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>
