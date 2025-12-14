import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { SignupUseCase } from '../../src/application/usecase/sign-up'
import { UserAlreadyExists } from '../../src/shared/utils/errors'

describe('SignupUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let signUpUseCase: SignupUseCase

  const makeUserData = (
    overrides: { email?: string; name?: string; password?: string } = {}
  ) => {
    const name = overrides.name ?? faker.person.fullName()
    const email = overrides.email ?? faker.internet.email()
    const password =
      overrides.password ?? faker.internet.password({ length: 8 })

    return {
      name,
      email,
      password,
      telephones: [{ number: 987654321, area_code: 11 }],
    }
  }

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    signUpUseCase = new SignupUseCase(usersRepository)
  })

  it('should sign up a new user successfully', async () => {
    const userData = makeUserData()

    const result = await signUpUseCase.execute(userData)

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.created_at).toBeDefined()
    expect(typeof result.created_at).toBe('string')
    expect(result.modified_at).toBeDefined()
    expect(typeof result.modified_at).toBe('string')
    expect(typeof result.id).toBe('string')
  })

  it('should not sign up a user with an existing email', async () => {
    const userData = makeUserData()
    await signUpUseCase.execute(userData)

    await expect(signUpUseCase.execute(userData)).rejects.toBeInstanceOf(
      UserAlreadyExists
    )
  })

  it('should hash user password upon sign up', async () => {
    const userData = makeUserData()

    await signUpUseCase.execute(userData)
    const storedUser = await usersRepository.findByEmail(userData.email)

    expect(storedUser).toBeDefined()
    expect(storedUser!.password).not.toBe(userData.password)
    const isPasswordValid = await bcrypt.compare(
      userData.password,
      storedUser!.password
    )
    expect(isPasswordValid).toBe(true)
  })

  it('should throw ValidationError for invalid email', async () => {
    const userData = makeUserData({ email: 'invalid-email' })

    await expect(signUpUseCase.execute(userData)).rejects.toThrow(
      'Please provide a valid e-mail'
    )
  })

  it('should throw ValidationError for empty name', async () => {
    const userData = makeUserData({ name: '' })

    await expect(signUpUseCase.execute(userData)).rejects.toThrow(
      'Name is required'
    )
  })

  it('should throw ValidationError for short password', async () => {
    const userData = makeUserData({ password: '123' })

    await expect(signUpUseCase.execute(userData)).rejects.toThrow(
      'Password must have at least 6 characters'
    )
  })
})
