import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { GetUserByIdController } from '../../src/application/controller/get-user-by-id-controller'
import { GetUserByIdUseCase } from '../../src/application/usecase/get-user-by-id'
import { UserNotFoundError } from '../../src/shared/utils/errors'
import { IRequest } from '../../src/application/controller/interfaces/IController'

type GetUserByIdUseCaseExecute = (userId: string) => Promise<{
  user: {
    id: string
    name: string
    email: string
    telephones: Array<{ area_code: number; number: number }>
    created_at: string
    modified_at: string
  }
}>

describe('GetUserByIdController', () => {
  let getUserByIdUseCaseMock: jest.Mocked<GetUserByIdUseCase>
  let controller: GetUserByIdController

  const makeUserData = (overrides: { id?: string } = {}) => {
    return {
      id: overrides.id ?? faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      telephones: [{ area_code: 11, number: 987654321 }],
      created_at: faker.date.past().toISOString(),
      modified_at: faker.date.recent().toISOString()
    }
  }

  beforeEach(() => {
    getUserByIdUseCaseMock = {
      execute: jest.fn<GetUserByIdUseCaseExecute>().mockResolvedValue({
        user: makeUserData()
      })
    } as unknown as jest.Mocked<GetUserByIdUseCase>
    
    controller = new GetUserByIdController(getUserByIdUseCaseMock)
  })

  it('should return 401 when userId is not provided in metadata', async () => {
    const request: IRequest = {
      body: {},
      metadata: {}
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ errorMessage: 'Invalid access token' })
  })

  it('should return 200 with user data when user exists', async () => {
    const userId = 'valid-user-id'
    const userData = makeUserData({ id: userId })

    getUserByIdUseCaseMock.execute.mockResolvedValueOnce({ user: userData })

    const request: IRequest = {
      body: {},
      metadata: { id: userId }
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(userData)
    expect(getUserByIdUseCaseMock.execute).toHaveBeenCalledWith(userId)
    expect(getUserByIdUseCaseMock.execute).toHaveBeenCalledTimes(1)
  })

  it('should return 401 when user is not found', async () => {
    const userId = 'non-existent-id'
    
    getUserByIdUseCaseMock.execute.mockRejectedValueOnce(new UserNotFoundError())

    const request: IRequest = {
      body: {},
      metadata: { id: userId }
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({ errorMessage: 'User not found' })
  })

  it('should return 500 when an unexpected error occurs', async () => {
    const userId = 'valid-user-id'
    
    getUserByIdUseCaseMock.execute.mockRejectedValueOnce(new Error('Database error'))

    const request: IRequest = {
      body: {},
      metadata: { id: userId }
    }

    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({ errorMessage: 'Internal server error' })
  })

  it('should call use case with correct userId from metadata', async () => {
    const userId = 'test-user-id'
    const userData = makeUserData({ id: userId })

    getUserByIdUseCaseMock.execute.mockResolvedValueOnce({ user: userData })

    const request: IRequest = {
      body: {},
      metadata: { id: userId }
    }

    await controller.handle(request)

    expect(getUserByIdUseCaseMock.execute).toHaveBeenCalledWith(userId)
    expect(getUserByIdUseCaseMock.execute).toHaveBeenCalledTimes(1)
  })
})