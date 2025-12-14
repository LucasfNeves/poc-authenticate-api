import { Request, Response } from 'express'
import { IController } from '../../../application/controller/interfaces/IController'

interface RequestWithUserId extends Request {
  userId?: string
}

export const routeAdapter = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const request = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      userId: (req as RequestWithUserId).userId,
    }

    const httpResponse = await controller.handle(request)

    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
