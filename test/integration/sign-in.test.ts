import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { SignInUseCase } from '../../src/application/usecase/sign-in'
import { beforeEach, describe, it, expect, jest } from '@jest/globals'
import { JwtAdapter, JwtAdapterImpl } from '../../src/domain/JwtAdapter'
import { InvalidCredentialsError } from '../../src/shared/utils/errors'
import { BCRYPT_SALT_ROUNDS } from '../../src/config/constant'

describe('SignInUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let jwtAdapter: JwtAdapter
  let jwtSignSpy: jest.Mock
  let signInUseCase: SignInUseCase

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
    signInUseCase = new SignInUseCase(usersRepository, jwtAdapter)
  })

  it('should be able to sign in', async () => {
    const { email, password } = await createUser()

    const { accessToken } = await signInUseCase.execute({
      email,
      password,
    })

    expect(accessToken).toBeTruthy()
  })

  it('should include email and id in JWT token payload', async () => {
    const { email, password, user } = await createUser()

    await signInUseCase.execute({
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

  it('should not sign in with wrong password', async () => {
    const { email } = await createUser()

    const promise = signInUseCase.execute({
      email,
      password: 'wrong-password',
    })

    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not sign in with non existing email', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password({ length: 10 })

    const promise = signInUseCase.execute({
      email,
      password,
    })

    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not sign in with wrong email', async () => {
    const { password } = await createUser()
    const email = faker.internet.email()

    const promise = signInUseCase.execute({
      email,
      password,
    })

    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
