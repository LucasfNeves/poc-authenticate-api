import { compare } from 'bcrypt'
import { UsersRepository } from '../../infrastructure/repository/interfaces'
import { JwtAdapter } from '../../domain/JwtAdapter'
import { ACCESS_TOKEN_EXPIRATION } from '../../config/constant'
import { InvalidCredentialsError } from '../../shared/utils/errors'
import { Email, Password } from '../../domain/value-objects'

interface SignInUseCaseParams {
  email: string
  password: string
}

interface SignInUseCaseResponse {
  accessToken: string
}

export class SignInUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private readonly jwtAdapter: JwtAdapter
  ) {}

  private async generateTokens(payload: {
    id: string
    email: string
  }): Promise<{ accessToken: string }> {
    const accessToken = this.jwtAdapter.sign(
      { sub: payload },
      ACCESS_TOKEN_EXPIRATION
    )

    return { accessToken }
  }

  async execute({
    email,
    password,
  }: SignInUseCaseParams): Promise<SignInUseCaseResponse> {
    const emailVO = Email.create(email)
    const passwordVO = Password.create(password)

    const user = await this.usersRepository.findByEmail(emailVO.getValue())

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(
      passwordVO.getValue(),
      user.password
    )

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    const { accessToken } = await this.generateTokens({
      id: user.id,
      email: user.email,
    })

    return { accessToken }
  }
}
