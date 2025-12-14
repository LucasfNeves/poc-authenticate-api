// src/adapters/jwt-adapter.ts
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface JwtAdapter {
  sign(payload: object, expiresIn: string): string
}

export class JwtAdapterImpl implements JwtAdapter {
  sign(payload: object, expiresIn: string): string {
    return jwt.sign(payload, env.jwtSecret, { expiresIn } as jwt.SignOptions)
  }
}
