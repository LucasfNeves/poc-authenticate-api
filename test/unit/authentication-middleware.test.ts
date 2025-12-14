import { describe, it, expect, beforeEach } from '@jest/globals'
import jwt from 'jsonwebtoken'
import { AuthenticationMiddleware } from '../../src/application/middlewares/AuthenticationMiddleware'

describe('AuthenticationMiddleware', () => {
  let middleware: AuthenticationMiddleware
  const secret = 'test-secret-key'

  beforeEach(() => {
    middleware = new AuthenticationMiddleware()
    process.env.JWT_SECRET = secret
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

  it('should return 401 when token has invalid signature', async () => {
    const payload = { sub: { id: 'user-123' } }
    const token = jwt.sign(payload, 'wrong-secret')
    const request = { headers: { authorization: `Bearer ${token}` } }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      statusCode: 401,
      body: { error: 'Unauthorized' }
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

  it('should return 401 for any JWT verification error', async () => {
    const request = { headers: { authorization: 'Bearer expired.or.invalid.token' } }

    const result = await middleware.handle(request)

    expect(result).toEqual({
      statusCode: 401,
      body: { error: 'Unauthorized' }
    })
  })
})