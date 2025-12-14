import jwt from 'jsonwebtoken'
import { JwtAdapterImpl } from '../../src/domain/JwtAdapter'
import { env } from '../../src/config/env'

describe('JwtAdapter', () => {
  let jwtAdapter: JwtAdapterImpl
  let secret: string

  beforeEach(() => {
    jwtAdapter = new JwtAdapterImpl()
    secret = env.jwtSecret
  })

  it('should create a valid JWT token', () => {
    const payload = { sub: 'user-123', email: 'user@example.com' }
    const expiresIn = '1d'

    const token = jwtAdapter.sign(payload, expiresIn)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  it('should create token with correct payload', () => {
    const payload = { sub: 'user-123', role: 'admin' }
    const expiresIn = '2h'

    const token = jwtAdapter.sign(payload, expiresIn)
    const decoded = jwt.verify(token, secret) as any

    expect(decoded.sub).toBe('user-123')
    expect(decoded.role).toBe('admin')
  })

  it('should create token with expiration time', () => {
    const payload = { sub: 'user-123' }
    const expiresIn = '1h'

    const token = jwtAdapter.sign(payload, expiresIn)
    const decoded = jwt.verify(token, secret) as any

    expect(decoded.exp).toBeDefined()
    expect(decoded.iat).toBeDefined()
    expect(decoded.exp).toBeGreaterThan(decoded.iat)
  })

  test.each([
    ['1h', 3600],
    ['2h', 7200],
    ['1d', 86400],
    ['7d', 604800],
  ])(
    'should create token with correct expiration time: %s',
    (expiresIn, expectedSeconds) => {
      const payload = { sub: 'user-123' }

      const token = jwtAdapter.sign(payload, expiresIn)
      const decoded = jwt.verify(token, secret) as any

      const timeDiff = decoded.exp - decoded.iat
      expect(timeDiff).toBe(expectedSeconds)
    }
  )

  it('should create different tokens for different payloads', () => {
    const payload1 = { sub: 'user-123' }
    const payload2 = { sub: 'user-456' }
    const expiresIn = '1d'

    const token1 = jwtAdapter.sign(payload1, expiresIn)
    const token2 = jwtAdapter.sign(payload2, expiresIn)

    expect(token1).not.toBe(token2)
  })

  it('should create different tokens on subsequent calls', async () => {
    const payload = { sub: 'user-123' }
    const expiresIn = '1d'

    const token1 = jwtAdapter.sign(payload, expiresIn)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const token2 = jwtAdapter.sign(payload, expiresIn)

    expect(token1).not.toBe(token2)
  })

  it('should handle complex payloads', () => {
    const payload = {
      sub: 'user-123',
      email: 'user@example.com',
      roles: ['admin', 'user'],
      metadata: {
        lastLogin: new Date().toISOString(),
        loginCount: 42,
      },
    }
    const expiresIn = '1d'

    const token = jwtAdapter.sign(payload, expiresIn)
    const decoded = jwt.verify(token, secret) as any

    expect(decoded.sub).toBe(payload.sub)
    expect(decoded.email).toBe(payload.email)
    expect(decoded.roles).toEqual(payload.roles)
    expect(decoded.metadata).toEqual(payload.metadata)
  })

  it('should create token that can be verified with the same secret', () => {
    const payload = { sub: 'user-123' }
    const expiresIn = '1d'

    const token = jwtAdapter.sign(payload, expiresIn)

    expect(() => jwt.verify(token, secret)).not.toThrow()
  })

  it('should create token that fails verification with wrong secret', () => {
    const payload = { sub: 'user-123' }
    const expiresIn = '1d'

    const token = jwtAdapter.sign(payload, expiresIn)

    expect(() => jwt.verify(token, 'wrong-secret')).toThrow()
  })
})
