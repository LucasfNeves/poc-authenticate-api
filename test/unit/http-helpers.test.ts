import { describe, it, expect } from '@jest/globals'
import {
  badRequest,
  conflict,
  unauthorized,
  userNotFound,
  notFoundError,
  created,
  serverError,
  ok,
} from '../../src/application/controller/helpers/http'

describe('HTTP Helpers', () => {
  describe('badRequest', () => {
    it('should return status 400 with body', () => {
      const body = { errorMessage: 'Invalid data' }
      const response = badRequest(body)

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual(body)
    })

    it('should handle multiple fields in body', () => {
      const body = {
        errorMessage: 'Validation failed',
        field: 'email',
        value: 'invalid',
      }
      const response = badRequest(body)

      expect(response.statusCode).toBe(400)
      expect(response.body).toEqual(body)
    })
  })

  describe('conflict', () => {
    it('should return status 409 with body', () => {
      const body = { errorMessage: 'Resource already exists' }
      const response = conflict(body)

      expect(response.statusCode).toBe(409)
      expect(response.body).toEqual(body)
    })

    it('should handle custom message', () => {
      const body = { message: 'Email already in use' }
      const response = conflict(body)

      expect(response.statusCode).toBe(409)
      expect(response.body.message).toBe('Email already in use')
    })
  })

  describe('unauthorized', () => {
    it('should return status 401 with body', () => {
      const body = { errorMessage: 'Unauthorized access' }
      const response = unauthorized(body)

      expect(response.statusCode).toBe(401)
      expect(response.body).toEqual(body)
    })

    it('should handle authentication error', () => {
      const body = { errorMessage: 'Invalid credentials' }
      const response = unauthorized(body)

      expect(response.statusCode).toBe(401)
      expect(response.body.errorMessage).toBe('Invalid credentials')
    })
  })

  describe('userNotFound', () => {
    it('should return status 404 with error message', () => {
      const errorMessage = 'User not found'
      const response = userNotFound({ errorMessage })

      expect(response.statusCode).toBe(404)
      expect(response.body).toEqual({ errorMessage })
    })

    it('should handle custom not found message', () => {
      const errorMessage = 'User with ID 123 not found'
      const response = userNotFound({ errorMessage })

      expect(response.statusCode).toBe(404)
      expect(response.body.errorMessage).toBe(errorMessage)
    })
  })

  describe('notFoundError', () => {
    it('should return status 404 with error message', () => {
      const errorMessage = 'Resource not found'
      const response = notFoundError({ errorMessage })

      expect(response.statusCode).toBe(404)
      expect(response.body).toEqual({ errorMessage })
    })

    it('should handle generic not found error', () => {
      const errorMessage = 'The requested resource was not found'
      const response = notFoundError({ errorMessage })

      expect(response.statusCode).toBe(404)
      expect(response.body.errorMessage).toBe(errorMessage)
    })
  })

  describe('created', () => {
    it('should return status 201 with body', () => {
      const body = { message: 'User created successfully', id: '123' }
      const response = created(body)

      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual(body)
    })

    it('should handle response with data', () => {
      const body = {
        id: 'user-123',
        created_at: new Date(),
        modified_at: new Date(),
      }
      const response = created(body)

      expect(response.statusCode).toBe(201)
      expect(response.body.id).toBe('user-123')
      expect(response.body.created_at).toBeInstanceOf(Date)
      expect(response.body.modified_at).toBeInstanceOf(Date)
    })
  })

  describe('serverError', () => {
    it('should return status 500 with internal server error message', () => {
      const response = serverError()

      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual({
        errorMessage: 'Internal server error',
      })
    })

    it('should always return same error structure', () => {
      const response1 = serverError()
      const response2 = serverError()

      expect(response1).toEqual(response2)
    })
  })

  describe('ok', () => {
    it('should return status 200 with single object', () => {
      const body = { name: 'John Doe', email: 'john@example.com' }
      const response = ok(body)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(body)
    })

    it('should return status 200 with array', () => {
      const body = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ]
      const response = ok(body)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(body)
    })

    it('should handle empty object', () => {
      const body = {}
      const response = ok(body)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(body)
    })

    it('should handle empty array', () => {
      const body: unknown[] = []
      const response = ok(body)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(body)
    })
  })
})
