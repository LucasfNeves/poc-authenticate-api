import { AuthenticateUseCase } from '../usecase/authenticate'
import { IController, IRequest, IResponse } from './interfaces/IController'
import {
  InvalidCredentialsError,
  ValidationError,
} from '../../shared/utils/errors'
import { badRequest, ok, serverError, unauthorized } from './helpers/http'

export class AuthenticateUserController implements IController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const { email, password } = request.body as {
        email: string
        password: string
      }

      const { accessToken } = await this.authenticateUseCase.execute({
        email,
        password,
      })

      return ok({ accessToken })
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest({
          message: error.message,
        })
      }

      if (error instanceof InvalidCredentialsError) {
        return unauthorized({
          message: error.message,
        })
      }

      if (error instanceof Error) {
        return badRequest({ message: error.message })
      }

      return serverError()
    }
  }
}
