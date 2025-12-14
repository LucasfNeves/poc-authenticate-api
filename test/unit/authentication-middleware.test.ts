import { describe, it, expect, beforeEach } from '@jest/globals'
import jwt from 'jsonwebtoken'
import { AuthenticationMiddleware } from '../../src/application/middlewares/AuthenticationMiddleware'
import { env } from '../../src/config/env'

describe('AuthenticationMiddleware', () => {
  let middleware: AuthenticationMiddleware
  const secret = env.jwtSecret as string

  beforeEach(() => {
    middleware = new AuthenticationMiddleware()
  })

  it('should return 401 when authorization header is missing', async () => {
    const request = { headers: {} }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      statusCode: 401,
      body: { error: 'Unauthorized' }
    })
  })

  it('should return 401 when authorization header is not Bearer', async () => {
    const request = { headers: { authorization: 'Basic token123' } }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      statusCode: 401,
      body: { error: 'Unauthorized' }
    })
  })

  it('should return 401 when token is invalid', async () => {
    const request = { headers: { authorization: 'Bearer invalid-token' } }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      statusCode: 401,
      body: { error: 'Unauthorized' }
    })
  })

  it('should return 401 when token payload is missing sub.id', async () => {
    const payload = { sub: {} }
    const token = jwt.sign(payload, secret)
    const request = { headers: { authorization: `Bearer ${token}` } }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      statusCode: 401,
      body: { error: 'Invalid Token' }
    })
  })

  it('should return user data when token is valid', async () => {
    const payload = {
      sub: { id: 'user-123', email: 'user@example.com' },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }
    const token = jwt.sign(payload, secret)
    const request = { headers: { authorization: `Bearer ${token}` } }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      data: {
        id: 'user-123',
        email: 'user@example.com'
      }
    })
  })

  it('should handle token without Bearer prefix', async () => {
    const request = { headers: { authorization: 'token123' } }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      statusCode: 401,
      body: { error: 'Unauthorized' }
    })
  })

  it('should handle expired token', async () => {
    const payload = {
      sub: { id: 'user-123', email: 'user@example.com' },
      iat: Math.floor(Date.now() / 1000) - 7200,
      exp: Math.floor(Date.now() / 1000) - 3600
    }
    const token = jwt.sign(payload, secret)
    const request = { headers: { authorization: `Bearer ${token}` } }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      statusCode: 401,
      body: { error: 'Unauthorized' }
    })
  })
})