import bcrypt from 'bcrypt'
import { UserAlreadyExists } from '../../shared/utils/errors'
import { BCRYPT_SALT_ROUNDS } from '../../config/constant'
import { UsersRepository } from '../../infrastructure/repository/interfaces'
import { Email, Name, Password, Telephone } from '../../domain/value-objects'
import { TelephoneType } from '../../shared/utils/types'

interface UserJSON {
  id: string
  name: string
  email: string
  password: string
  telephones: TelephoneType[]
  created_at: string
  updated_at: string
}

interface SignupUserUseCaseParams {
  email: string
  name: string
  password: string
  telephones: TelephoneType[]
}

interface SignupUseCaseResponse {
  id: string
  created_at: string
  modified_at: string
}

export class SignupUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    params: SignupUserUseCaseParams
  ): Promise<SignupUseCaseResponse> {
    const { name, email, password, telephones } = params

    const emailVO = Email.create(email)
    const nameVO = Name.create(name)
    const passwordVO = Password.create(password)
    const telephonesVO = Telephone.createMany(telephones)

    const hasedPassword = await bcrypt.hash(
      passwordVO.getValue(),
      BCRYPT_SALT_ROUNDS
    )

    const userWithSameEmail = await this.usersRepository.findByEmail(
      emailVO.getValue()
    )

    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const telephonesData = telephonesVO.map((tel) => tel.getValue())

    const createdUser = await this.usersRepository.create({
      name: nameVO.getValue(),
      email: emailVO.getValue(),
      password: hasedPassword,
      telephones: telephonesData,
    })

    const userJson = createdUser.toJSON() as UserJSON

    return {
      id: createdUser.id,
      created_at: userJson.created_at,
      modified_at: userJson.updated_at,
    }
  }
}
