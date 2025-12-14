import { SequelizeUsersRepository } from '../repository/sequelize/sequelize-users-repository'
import { RegisterUseCase } from '../../application/usecase/register'
import { CreateUserController } from '../../application/controller/register'
import { AuthenticateUseCase } from '../../application/usecase/authenticate'
import { AuthenticateUserController } from '../../application/controller/authenticate'
import { JwtAdapterImpl } from '../../domain/JwtAdapter'

export const makeRegisterUserController = () => {
  const usersRepository = new SequelizeUsersRepository()

  const registerUserUseCase = new RegisterUseCase(usersRepository)

  const createUserController = new CreateUserController(registerUserUseCase)

  return createUserController
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
