import { z } from 'zod'

const telephoneSchema = z.object({
  number: z.preprocess((val) => {
    if (val === undefined || val === null || val === '') {
      throw new Error('Phone number is required')
    }
    const num = typeof val === 'string' ? Number(val) : val
    if (typeof num === 'number' && isNaN(num)) {
      throw new Error('Phone number must be a valid number')
    }
    return num
  }, z.number().int({ message: 'Phone number must be an integer' }).positive({ message: 'Phone number must be a positive integer' })),
  area_code: z.preprocess((val) => {
    if (val === undefined || val === null || val === '') {
      throw new Error('Area code is required')
    }
    const num = typeof val === 'string' ? Number(val) : val
    if (typeof num === 'number' && isNaN(num)) {
      throw new Error('Area code must be a valid number')
    }
    return num
  }, z.number().int({ message: 'Area code must be an integer' }).positive({ message: 'Area code must be a positive integer' })),
})

export const createUserSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .trim()
    .min(1, { message: 'Name is required' }),
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .pipe(z.email({ message: 'Please provide a valid e-mail' })),
  password: z
    .string({ message: 'Password is required' })
    .trim()
    .min(6, { message: 'Password must have at least 6 characters' }),
  telephones: z.preprocess((val) => {
    if (val === undefined || val === null) {
      throw new Error('Telephones field is required')
    }
    if (!Array.isArray(val)) {
      throw new Error('Telephones must be an array')
    }
    return val
  }, z.array(telephoneSchema).min(1, { message: 'At least one telephone is required' })),
})

export const authenticateUserSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .pipe(z.email({ message: 'Please provide a valid e-mail' })),
  password: z
    .string({ message: 'Password is required' })
    .trim()
    .min(6, { message: 'Password must have at least 6 characters' }),
})
