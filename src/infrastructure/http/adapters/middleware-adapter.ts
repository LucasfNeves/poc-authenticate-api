import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from '../../../application/controller/interfaces/IMiddleware'

export function middlewareAdapter(middleware: IMiddleware) {
  return async (request: Request & { metadata?: Record<string, unknown> }, response: Response, next: NextFunction) => {
    const result = await middleware.handle({
      headers: request.headers as Record<string, unknown>,
    })

    if ('statusCode' in result) {
      return response.status(result.statusCode).json(result.body)
    }

    if ('data' in result) {
      request.metadata = {
        ...request.metadata,
        ...result.data,
      }
    }

    next()
  }
}