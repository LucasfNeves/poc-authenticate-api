import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { RegisterUseCase } from '../../src/application/usecase/register'
import { UserAlreadyExists } from '../../src/shared/utils/errors'
import {
  Email,
  Name,
  Password,
  Telephone,
} from '../../src/domain/value-objects'

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

const makeUserData = (
  overrides: { email?: string; name?: string; password?: string } = {}
) => {
  const name = overrides.name || faker.person.fullName()
  const email = overrides.email || faker.internet.email()
  const password = overrides.password || faker.internet.password({ length: 8 })

  return {
    name: Name.create(name),
    email: Email.create(email),
    password: Password.create(password),
    telephones: [Telephone.create(987654321, 11)],
  }
}

beforeEach(async () => {
  usersRepository = new InMemoryUsersRepository()
  registerUseCase = new RegisterUseCase(usersRepository)
})

it('should register a new user successfully', async () => {
  const userData = makeUserData()

  const result = await registerUseCase.execute(userData)

  expect(result).toBeDefined()
  expect(result.id).toBeDefined()
  expect(result.created_at).toBeInstanceOf(Date)
  expect(result.modified_at).toBeInstanceOf(Date)
  expect(typeof result.id).toBe('string')
})

it('should not register a user with an existing email', async () => {
  const userData = makeUserData()

  await registerUseCase.execute(userData)

  await expect(registerUseCase.execute(userData)).rejects.toBeInstanceOf(
    UserAlreadyExists
  )
})

it('should hash user password upon registration', async () => {
  const userData = makeUserData()

  await registerUseCase.execute(userData)
  const storedUser = await usersRepository.findByEmail(
    userData.email.getValue()
  )

  expect(storedUser).toBeDefined()
  expect(storedUser!.password).not.toBe(userData.password.getValue())
  const isPasswordValid = await bcrypt.compare(
    userData.password.getValue(),
    storedUser!.password
  )
  expect(isPasswordValid).toBe(true)
})
