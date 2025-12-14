import bcrypt from 'bcrypt'
import { UserAlreadyExists } from '../../shared/utils/errors'
import { BCRYPT_SALT_ROUNDS } from '../../config/constant'
import { UsersRepository } from '../../infrastructure/repository/interfaces'
import { Email, Name, Password, Telephone } from '../../domain/value-objects'

interface RegisterUserUseCaseParams {
  email: Email
  name: Name
  password: Password
  telephones: Telephone[]
}

interface RegisterUseCaseResponse {
  id: string
  created_at: Date
  modified_at: Date
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    params: RegisterUserUseCaseParams
  ): Promise<RegisterUseCaseResponse> {
    const { name, email, password, telephones } = params

    const hasedPassword = await bcrypt.hash(
      password.getValue(),
      BCRYPT_SALT_ROUNDS
    )

    const userWithSameEmail = await this.usersRepository.findByEmail(
      email.getValue()
    )

    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const telephonesData = telephones.map((tel) => tel.getValue())

    const createdUser = await this.usersRepository.create({
      name: name.getValue(),
      email: email.getValue(),
      password: hasedPassword,
      telephones: telephonesData,
    })

    return {
      id: createdUser.id,
      created_at: createdUser.createdAt,
      modified_at: createdUser.updatedAt,
    }
  }
}
