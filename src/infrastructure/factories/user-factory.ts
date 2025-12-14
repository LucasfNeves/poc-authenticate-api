import { SequelizeUsersRepository } from '../repository/sequelize/sequelize-users-repository'
import { SignupUseCase } from '../../application/usecase/sign-up'
import { SignupController } from '../../application/controller/sign-up'
import { SignInUseCase } from '../../application/usecase/sign-in'
import { SignInController } from '../../application/controller/sign-in'
import { GetUserByIdUseCase } from '../../application/usecase/get-user-by-id'
import { GetUserByIdController } from '../../application/controller/get-user-by-id-controller'
import { JwtAdapterImpl } from '../../domain/JwtAdapter'

export const makeSignupUserController = () => {
  const usersRepository = new SequelizeUsersRepository()

  const signupUserUseCase = new SignupUseCase(usersRepository)

  const signupUserController = new SignupController(signupUserUseCase)

  return signupUserController
}

export const makeSignInController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const jwtAdapter = new JwtAdapterImpl()

  const signInUseCase = new SignInUseCase(usersRepository, jwtAdapter)

  const signInController = new SignInController(signInUseCase)

  return signInController
}

export const makeGetUserByIdController = () => {
  const usersRepository = new SequelizeUsersRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(usersRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}
