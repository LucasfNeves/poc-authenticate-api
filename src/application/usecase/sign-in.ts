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
    console.log('SignIn - Raw input:', { email, password: password ? '[HIDDEN]' : 'undefined' })
    
    const emailVO = Email.create(email)
    const passwordVO = Password.create(password)
    
    console.log('SignIn - Email VO:', emailVO.getValue())
    console.log('SignIn - Password VO exists:', !!passwordVO.getValue())

    const user = await this.usersRepository.findByEmail(emailVO.getValue())
    console.log('SignIn - User found:', !!user)
    console.log('SignIn - User has password:', !!user?.password)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const userPassword = user.password
    const inputPassword = passwordVO.getValue()
    
    console.log('SignIn - User password type:', typeof userPassword)
    console.log('SignIn - Input password type:', typeof inputPassword)
    console.log('SignIn - User password exists:', !!userPassword)
    console.log('SignIn - Input password exists:', !!inputPassword)

    if (!userPassword || !inputPassword) {
      console.log('SignIn - Missing password data')
      throw new InvalidCredentialsError()
    }

    console.log('SignIn - About to compare passwords')
    const doesPasswordMatches = await compare(inputPassword, userPassword)
    console.log('SignIn - Password match result:', doesPasswordMatches)

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
