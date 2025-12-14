import { SequelizeUsersRepository } from '../repository/sequelize/sequelize-users-repository'
import { RegisterUseCase } from '../../application/usecase/register'
import { CreateUserController } from '../../application/controller/register'

export const makeRegisterUserController = () => {
  const usersRepository = new SequelizeUsersRepository()

  const registerUserUseCase = new RegisterUseCase(usersRepository)

  const createUserController = new CreateUserController(registerUserUseCase)

  return createUserController
}
