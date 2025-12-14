import { UserNotFoundError } from '../../shared/utils/errors'
import { IController, IRequest, IResponse } from './interfaces/IController'
import { GetUserByIdUseCase } from '../usecase/get-user-by-id'
import { ok, serverError, unauthorized } from './helpers/http'

export class GetUserByIdController implements IController {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const userId = request.metadata?.id as string

      if (!userId) {
        return unauthorized({ errorMessage: 'Invalid access token' })
      }

      const { user } = await this.getUserByIdUseCase.execute(userId)

      return ok(user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return unauthorized({ errorMessage: 'User not found' })
      }

      return serverError()
    }
  }
}