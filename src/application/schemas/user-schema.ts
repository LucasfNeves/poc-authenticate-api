import { z } from 'zod'

const telephoneSchema = z.object({
  number: z
    .number()
    .int()
    .positive({ message: 'Phone number must be a positive integer' }),
  area_code: z
    .number()
    .int()
    .positive({ message: 'Area code must be a positive integer' }),
})

export const createUserSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .pipe(z.email({ message: 'Please provide a valid e-mail' })),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must have at least 6 characters' }),
  telephones: z
    .array(telephoneSchema)
    .min(1, { message: 'At least one telephone is required' }),
})

export const authenticateUserSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .pipe(z.email({ message: 'Please provide a valid e-mail' })),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must have at least 6 characters' }),
})
