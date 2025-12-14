import jwt from 'jsonwebtoken'
import { env } from '../../config/env'
import {
  IData,
  IMiddleware,
  IRequest,
  IResponse,
} from '../controller/interfaces/IMiddleware'

interface Payload {
  sub: {
    id: string
    email: string
  }
  iat: number
  exp: number
}

export class AuthenticationMiddleware implements IMiddleware {
  async handle({ headers }: IRequest): Promise<IResponse | IData> {
    const { authorization } = headers as Record<string, string>

    if (!authorization) {
      return {
        statusCode: 401,
        body: { error: 'Unauthorized' },
      }
    }

    const [bearer, token] = authorization.split(' ')

    try {
      if (bearer !== 'Bearer') {
        return {
          statusCode: 401,
          body: { error: 'Unauthorized' },
        }
      }

      const payload = jwt.verify(token, env.jwtSecret!) as unknown as Payload
      const { sub } = payload

      if (!sub?.id) {
        return {
          statusCode: 401,
          body: { error: 'Invalid Token' },
        }
      }

      return {
        data: {
          id: sub.id,
          email: sub.email,
        },
      }
    } catch (error) {
      console.error(error)

      return {
        statusCode: 401,
        body: { error: 'Unauthorized' },
      }
    }
  }
}
