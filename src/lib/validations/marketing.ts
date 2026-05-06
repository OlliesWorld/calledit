import { z } from 'zod'

/**
 * Contact form validation
 */
export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  organization: z.string().max(255).optional(),
  teamSize: z.enum(['', '5-10', '11-25', '26-50', '51-100', '100+']).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
