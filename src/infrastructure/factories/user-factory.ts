import { SequelizeUsersRepository } from '../repository/sequelize/sequelize-users-repository'
import { SignupUseCase } from '../../application/usecase/sign-up'
import { SignupController } from '../../application/controller/sign-up'
import { AuthenticateUseCase } from '../../application/usecase/authenticate'
import { AuthenticateUserController } from '../../application/controller/authenticate'
import { GetUserByIdUseCase } from '../../application/usecase/get-user-by-id'
import { GetUserByIdController } from '../../application/controller/get-user-by-id-controller'
import { JwtAdapterImpl } from '../../domain/JwtAdapter'

export const makeSignupUserController = () => {
  const usersRepository = new SequelizeUsersRepository()

  const signupUserUseCase = new SignupUseCase(usersRepository)

  const signupUserController = new SignupController(signupUserUseCase)

  return signupUserController
}

export const makeAuthenticateUserController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const jwtAdapter = new JwtAdapterImpl()

  const authenticateUseCase = new AuthenticateUseCase(
    usersRepository,
    jwtAdapter
  )

  const authenticateUserController = new AuthenticateUserController(
    authenticateUseCase
  )

  return authenticateUserController
}

export const makeGetUserByIdController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(usersRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}
