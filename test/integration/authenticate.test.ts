import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { AuthenticateUseCase } from '../../src/application/usecase/authenticate'
import { beforeEach, describe, it, expect, jest } from '@jest/globals'
import { JwtAdapter, JwtAdapterImpl } from '../../src/domain/JwtAdapter'
import { InvalidCredentialsError } from '../../src/shared/utils/errors'
import { BCRYPT_SALT_ROUNDS } from '../../src/config/constant'

describe('AuthenticatorUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let jwtAdapter: JwtAdapter
  let jwtSignSpy: jest.Mock
  let authenticateUseCase: AuthenticateUseCase

  const createUser = async () => {
    const email = faker.internet.email()
    const password = faker.internet.password({ length: 10 })
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const user = await usersRepository.create({
      name: faker.person.fullName(),
      email,
      password: hashedPassword,
      telephones: [{ number: 987654321, area_code: 11 }],
    })

    return { email, password, user }
  }

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    jwtSignSpy = jest.fn().mockReturnValue('fake-jwt-token')
    jwtAdapter = {
      sign: jwtSignSpy,
    } as JwtAdapterImpl
    authenticateUseCase = new AuthenticateUseCase(usersRepository, jwtAdapter)
  })

  it('should be able to authenticate', async () => {
    const { email, password } = await createUser()

    const { accessToken } = await authenticateUseCase.execute({
      email,
      password,
    })

    expect(accessToken).toBeTruthy()
  })

  it('should include email and id in JWT token payload', async () => {
    const { email, password, user } = await createUser()

    await authenticateUseCase.execute({
      email,
      password,
    })

    expect(jwtSignSpy).toHaveBeenCalledTimes(1)
    const [payload] = jwtSignSpy.mock.calls[0]
    expect(payload).toEqual(
      expect.objectContaining({
        sub: expect.objectContaining({
          email,
          id: user.id,
        }),
      })
    )
  })

  it('should not authenticate with wrong password', async () => {
    const { email } = await createUser()

    const promise = authenticateUseCase.execute({
      email,
      password: 'wrong-password',
    })

    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate with non existing email', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password({ length: 10 })

    const promise = authenticateUseCase.execute({
      email,
      password,
    })

    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate with wrong email', async () => {
    const { password } = await createUser()
    const email = faker.internet.email()

    const promise = authenticateUseCase.execute({
      email,
      password,
    })

    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
