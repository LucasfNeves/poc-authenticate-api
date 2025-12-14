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
      try {
        createUserSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        })
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe('Telephones field is required')
        }
      }
    })

    it('should reject when name is missing', () => {
      const result = createUserSchema.safeParse({
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required')
      }
    })

    it('should reject when name is empty after trim', () => {
      const result = createUserSchema.safeParse({
        name: '   ',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required')
      }
    })

    it('should reject when email is missing', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required')
      }
    })

    it('should reject when email is invalid', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please provide a valid e-mail'
        )
      }
    })

    it('should reject when password is missing', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required')
      }
    })

    it('should reject when password is shorter than 6 characters', () => {
      const result = createUserSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
        telephones: [{ number: 987654321, area_code: 11 }],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must have at least 6 characters'
        )
      }
    })

    it('should reject when telephone number is missing', () => {
      try {
        createUserSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          telephones: [{ area_code: 11 }],
        })
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe('Phone number is required')
        }
      }
    })

    it('should reject when telephone area_code is missing', () => {
      try {
        createUserSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          telephones: [{ number: 987654321 }],
        })
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe('Area code is required')
        }
      }
    })

    it('should reject when telephone number is not a valid number', () => {
      try {
        createUserSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          telephones: [{ number: 'invalid', area_code: 11 }],
        })
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe('Phone number must be a valid number')
        }
      }
    })

    it('should reject when telephone area_code is not a valid number', () => {
      try {
        createUserSchema.parse({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          telephones: [{ number: 987654321, area_code: 'invalid' }],
        })
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe('Area code must be a valid number')
        }
      }
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

    it('should reject when email is missing', () => {
      const result = authenticateUserSchema.safeParse({
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required')
      }
    })

    it('should reject when email is invalid', () => {
      const result = authenticateUserSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please provide a valid e-mail'
        )
      }
    })

    it('should reject when password is missing', () => {
      const result = authenticateUserSchema.safeParse({
        email: 'john@example.com',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required')
      }
    })

    it('should reject when password is shorter than 6 characters', () => {
      const result = authenticateUserSchema.safeParse({
        email: 'john@example.com',
        password: '12345',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must have at least 6 characters'
        )
      }
    })
  })
})
