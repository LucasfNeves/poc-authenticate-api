import { faker } from '@faker-js/faker'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { GetUserByIdUseCase } from '../../src/application/usecase/get-user-by-id'
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository'
import { UserNotFoundError } from '../../src/shared/utils/errors'
import { BCRYPT_SALT_ROUNDS } from '../../src/config/constant'
import bcrypt from 'bcrypt'

describe('GetUserByIdUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let getUserByIdUseCase: GetUserByIdUseCase

  const createUser = async () => {
    const email = faker.internet.email()
    const name = faker.person.fullName()
    const password = faker.internet.password({ length: 10 })
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    const user = await usersRepository.create({
      name,
      email,
      password: hashedPassword,
      telephones: [{ number: 987654321, area_code: 11 }],
    })

    return { id: user.id, email, name }
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserByIdUseCase = new GetUserByIdUseCase(usersRepository)
  })
  it('should get user by id successfully', async () => {
    const { id, email, name } = await createUser()

    const result = await getUserByIdUseCase.execute(id)

    expect(result.user).toEqual(
      expect.objectContaining({
        id,
        email,
        name,
      })
    )
  })

  it('should call repository findById with correct id', async () => {
    const { id } = await createUser()
    const findByIdSpy = jest.spyOn(usersRepository, 'findById')

    await getUserByIdUseCase.execute(id)

    expect(findByIdSpy).toHaveBeenCalledWith(id)
    expect(findByIdSpy).toHaveBeenCalledTimes(1)
  })

  it('should throw UserNotFoundError when user does not exist', async () => {
    const nonExistentId = 'non-existent-id'

    await expect(
      getUserByIdUseCase.execute(nonExistentId)
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw error when repository fails', async () => {
    const { id } = await createUser()
    jest
      .spyOn(usersRepository, 'findById')
      .mockRejectedValueOnce(new Error('Database connection failed'))

    await expect(getUserByIdUseCase.execute(id)).rejects.toThrow(
      'Database connection failed'
    )
  })
})
