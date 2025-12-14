import { describe, it, expect } from '@jest/globals'
import {
  createUserSchema,
  authenticateUserSchema,
} from '../../src/application/schemas/user-schema'

describe('User Schemas', () => {
  describe('createUserSchema', () => {
    it('should validate and trim a valid payload with telephones', () => {
      const data = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        password: '  password123  ',
        telephones: [
          { number: 987654321, area_code: 11 },
          { number: 12345678, area_code: 21 },
        ],
      }

      const result = createUserSchema.safeParse(data)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.password).toBe('password123')
        expect(result.data.telephones).toHaveLength(2)
        expect(result.data.telephones[0]).toEqual({
          number: 987654321,
          area_code: 11,
        })
      }
    })

    it('should reject when telephones array is empty', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        telephones: [],
      })

      expect(result.success).toBe(false)
    })

    it('should reject when telephones is missing', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result.success).toBe(false)
    })

    it('should reject when name is missing or empty', () => {
      const result1 = createUserSchema.safeParse({
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      })
      const result2 = createUserSchema.safeParse({
        name: '   ',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result1.success).toBe(false)
      expect(result2.success).toBe(false)
    })

    it('should reject when email is invalid', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result.success).toBe(false)
    })

    it('should reject when password is shorter than 6 characters', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result.success).toBe(false)
    })
  })

  describe('authenticateUserSchema', () => {
    it('should validate and trim a valid payload', () => {
      const data = {
        email: '  john@example.com  ',
        password: '  password123  ',
      }

      const result = authenticateUserSchema.safeParse(data)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.password).toBe('password123')
      }
    })

    it('should reject when email is invalid', () => {
      const result = authenticateUserSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      })

      expect(result.success).toBe(false)
    })

    it('should reject when password is shorter than 6 characters', () => {
      const result = authenticateUserSchema.safeParse({
        email: 'john@example.com',
        password: '12345',
      })

      expect(result.success).toBe(false)
    })
  })
})
