import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { SignInController } from '../../src/application/controller/sign-in'
import {
  InvalidCredentialsError,
  ValidationError,
} from '../../src/shared/utils/errors'
import { SignInUseCase } from '../../src/application/usecase/sign-in'

type SignInUseCaseExecute = (params: {
  email: string
  password: string
}) => Promise<{ accessToken: string }>

describe('SignInController', () => {
  let signInUseCaseMock: jest.Mocked<SignInUseCase>
  let controller: SignInController

  const makeAuthData = (
    overrides: { email?: string; password?: string } = {}
  ) => {
    return {
      email: overrides.email ?? faker.internet.email(),
      password: overrides.password ?? faker.internet.password({ length: 8 }),
    }
  }

  beforeEach(() => {
    signInUseCaseMock = {
      execute: jest.fn<SignInUseCaseExecute>().mockResolvedValue({
        accessToken: 'valid-jwt-token',
      }),
    } as unknown as jest.Mocked<SignInUseCase>
    controller = new SignInController(signInUseCaseMock)
  })

  it('should return 200 with access token when credentials are valid', async () => {
    const authData = makeAuthData()

    const response = await controller.handle({
      body: authData,
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body.accessToken).toBe('valid-jwt-token')
    expect(signInUseCaseMock.execute).toHaveBeenCalledTimes(1)
  })

  it('should call use case with correct parameters', async () => {
    const authData = makeAuthData()

    await controller.handle({
      body: authData,
    })

    expect(signInUseCaseMock.execute).toHaveBeenCalledWith({
      email: authData.email,
      password: authData.password,
    })
  })

  it('should return 401 when credentials are invalid', async () => {
    signInUseCaseMock.execute.mockRejectedValueOnce(
      new InvalidCredentialsError()
    )

    const authData = makeAuthData()

    const response = await controller.handle({
      body: authData,
    })

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Invalid credentials')
  })

  it('should return 400 when validation fails for empty email', async () => {
    signInUseCaseMock.execute.mockRejectedValueOnce(
      new ValidationError('Email is required')
    )

    const authData = makeAuthData({ email: '' })

    const response = await controller.handle({
      body: authData,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Email is required')
  })

  it('should return 400 when validation fails for invalid email', async () => {
    signInUseCaseMock.execute.mockRejectedValueOnce(
      new ValidationError('Please provide a valid e-mail')
    )

    const authData = makeAuthData({ email: 'invalid-email' })

    const response = await controller.handle({
      body: authData,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Please provide a valid e-mail')
  })

  it('should return 400 when validation fails for empty password', async () => {
    signInUseCaseMock.execute.mockRejectedValueOnce(
      new ValidationError('Password is required')
    )

    const authData = makeAuthData({ password: '' })

    const response = await controller.handle({
      body: authData,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Password is required')
  })

  it('should return 400 when validation error occurs', async () => {
    signInUseCaseMock.execute.mockRejectedValueOnce(
      new ValidationError('Invalid input')
    )

    const authData = makeAuthData()

    const response = await controller.handle({
      body: authData,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Invalid input')
  })

  it('should return 400 when generic Error occurs', async () => {
    signInUseCaseMock.execute.mockRejectedValueOnce(
      new Error('Some error message')
    )

    const authData = makeAuthData()

    const response = await controller.handle({
      body: authData,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Some error message')
  })

  it('should return 500 when unknown error occurs', async () => {
    signInUseCaseMock.execute.mockRejectedValueOnce('Unknown error')

    const authData = makeAuthData()

    const response = await controller.handle({
      body: authData,
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toHaveProperty('errorMessage')
    expect(response.body.errorMessage).toBe('Internal server error')
  })
})
