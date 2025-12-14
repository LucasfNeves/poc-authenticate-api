import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface JwtAdapter {
  sign(payload: object, expiresIn: string): string
}

export class JwtAdapterImpl implements JwtAdapter {
  sign(payload: object, expiresIn: string): string {
    if (!env.jwtSecret) {
      throw new Error('JWT secret is not defined')
    }
    return jwt.sign(
      payload,
      env.jwtSecret as string,
      { expiresIn } as jwt.SignOptions
    )
  }
}
