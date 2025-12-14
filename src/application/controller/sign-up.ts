import { badRequest, conflict, created, serverError } from './helpers/http'
import { UserAlreadyExists, ValidationError } from '../../shared/utils/errors'
import { IController, IRequest, IResponse } from './interfaces/IController'
import { SignupRequestBody } from './types'

interface SignupUserUseCaseParams {
  execute: (params: {
    email: string
    name: string
    password: string
    telephones: Array<{ number: number; area_code: number }>
  }) => Promise<{ id: string; created_at: string; modified_at: string }>
}

export class SignupController implements IController {
  constructor(private readonly signupUserUseCase: SignupUserUseCaseParams) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { email, name, password, telephones } =
        body as unknown as SignupRequestBody

      const telephonesData = !telephones
        ? []
        : telephones.map((tel) => ({
            number: Number(tel.number),
            area_code: Number(tel.area_code),
          }))

      const { id, created_at, modified_at } =
        await this.signupUserUseCase.execute({
          email,
          name,
          password,
          telephones: telephonesData,
        })

      return created({ id, created_at, modified_at })
    } catch (error) {
      if (error instanceof ValidationError) {
        return badRequest({
          message: error.message,
        })
      }

      if (error instanceof UserAlreadyExists) {
        return conflict({
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
