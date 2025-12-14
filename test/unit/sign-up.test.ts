import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { SignupController } from '../../src/application/controller/sign-up'
import {
  UserAlreadyExists,
  ValidationError,
} from '../../src/shared/utils/errors'

type SignUpUseCaseExecute = (params: {
  email: string
  name: string
  password: string
  telephones: Array<{ number: number; area_code: number }>
}) => Promise<{ id: string; created_at: string; modified_at: string }>

describe('CreateUserController', () => {
  let signUpUseCaseMock: {
    execute: jest.MockedFunction<SignUpUseCaseExecute>
  }
  let controller: SignupController

  beforeEach(() => {
    const now = new Date().toISOString()
    signUpUseCaseMock = {
      execute: jest.fn<SignUpUseCaseExecute>().mockResolvedValue({
        id: 'user-id-123',
        created_at: now,
        modified_at: now,
      }),
    }
    controller = new SignupController(signUpUseCaseMock)
  })

  it('should return 200 with user data when user is created successfully', async () => {
    const response = await controller.handle({
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBe('user-id-123')
    expect(typeof response.body.created_at).toBe('string')
    expect(typeof response.body.modified_at).toBe('string')
    expect(signUpUseCaseMock.execute).toHaveBeenCalledTimes(1)
  })

  it('should call use case with correct value objects including telephones', async () => {
    await controller.handle({
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        telephones: [
          { number: 987654321, area_code: 11 },
          { number: 12345678, area_code: 21 },
        ],
      },
    })

    expect(signUpUseCaseMock.execute).toHaveBeenCalledWith({
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password123',
      telephones: [
        { number: 987654321, area_code: 11 },
        { number: 12345678, area_code: 21 },
      ],
    })
  })

  it('should return 409 when user already exists', async () => {
    signUpUseCaseMock.execute.mockRejectedValueOnce(new UserAlreadyExists())

    const response = await controller.handle({
      body: {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      },
    })

    expect(response.statusCode).toBe(409)
    expect(response.body.message).toBe('User already exists')
  })

  it('should return 400 when validation fails', async () => {
    signUpUseCaseMock.execute.mockRejectedValueOnce(
      new ValidationError('Name is required')
    )

    const response = await controller.handle({
      body: {
        name: '',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Name is required')
  })

  it('should return 400 when telephones array is empty', async () => {
    signUpUseCaseMock.execute.mockRejectedValueOnce(
      new ValidationError('At least one telephone is required')
    )

    const response = await controller.handle({
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        telephones: [],
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('At least one telephone is required')
  })

  it('should return 400 when value object throws error', async () => {
    signUpUseCaseMock.execute.mockRejectedValueOnce(
      new ValidationError('Name must have at least 2 characters')
    )

    const response = await controller.handle({
      body: {
        name: 'J',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toContain('at least 2 characters')
  })

  it('should return 400 when generic error occurs in use case', async () => {
    signUpUseCaseMock.execute.mockRejectedValueOnce(new Error('Database error'))

    const response = await controller.handle({
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Database error')
  })

  it('should return 500 when unknown error occurs', async () => {
    signUpUseCaseMock.execute.mockRejectedValueOnce('Unknown error')

    const response = await controller.handle({
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      },
    })

    expect(response.statusCode).toBe(500)
    expect(response.body.errorMessage).toBe('Internal server error')
  })
})
