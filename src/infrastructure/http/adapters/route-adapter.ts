import { Request, Response } from 'express'
import { IController } from '../../../application/controller/interfaces/IController'

interface RequestWithMetadata extends Request {
  userId?: string
  metadata?: Record<string, unknown>
}

export const routeAdapter = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const request = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      userId: (req as RequestWithMetadata).userId,
      metadata: (req as RequestWithMetadata).metadata,
    }

    const httpResponse = await controller.handle(request)

    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
