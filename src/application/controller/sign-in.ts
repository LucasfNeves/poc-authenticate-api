import { SignInUseCase } from '../usecase/sign-in'
import { IController, IRequest, IResponse } from './interfaces/IController'
import {
  InvalidCredentialsError,
  ValidationError,
} from '../../shared/utils/errors'
import { badRequest, ok, serverError, unauthorized } from './helpers/http'

export class SignInController implements IController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const { email, password } = request.body as {
        email: string
        password: string
      }

      const { accessToken } = await this.signInUseCase.execute({
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
