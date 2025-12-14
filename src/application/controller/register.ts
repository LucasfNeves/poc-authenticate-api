import { z } from 'zod'
import { badRequest, conflict, created, serverError } from './helpers/http'
import { UserAlreadyExists } from '../../shared/utils/errors'
import { IController, IRequest, IResponse } from './interfaces/IController'
import { createUserSchema } from '../schemas/user-schema'
import { Email, Name, Password, Telephone } from '../../domain/value-objects'

interface RegisterUserUseCaseParams {
  execute: (params: {
    email: Email
    name: Name
    password: Password
    telephones: Telephone[]
  }) => Promise<{ id: string; created_at: Date; modified_at: Date }>
}

export class CreateUserController implements IController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCaseParams
  ) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { email, name, password, telephones } =
        await createUserSchema.parseAsync(body)

      const emailVO = Email.create(email)
      const nameVO = Name.create(name)
      const passwordVO = Password.create(password)
      const telephonesVO = telephones.map((tel) =>
        Telephone.create(tel.number, tel.area_code)
      )

      const { id, created_at, modified_at } =
        await this.registerUserUseCase.execute({
          email: emailVO,
          name: nameVO,
          password: passwordVO,
          telephones: telephonesVO,
        })

      return created({ id, created_at, modified_at })
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
        return conflict({
          message: error.message,
        })
      }

      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0].message
        return badRequest({ errorMessage })
      }

      if (error instanceof Error) {
        return badRequest({ message: error.message })
      }

      return serverError()
    }
  }
}
