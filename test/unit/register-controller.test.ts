import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { CreateUserController } from '../../src/application/controller/register'
import { UserAlreadyExists } from '../../src/shared/utils/errors'
import {
  Email,
  Name,
  Password,
  Telephone,
} from '../../src/domain/value-objects'

type RegisterUseCaseExecute = (params: {
  email: Email
  name: Name
  password: Password
  telephones: Telephone[]
}) => Promise<{ id: string; created_at: string; modified_at: string }>

describe('CreateUserController', () => {
  let registerUseCaseMock: {
    execute: jest.MockedFunction<RegisterUseCaseExecute>
  }
  let controller: CreateUserController

  beforeEach(() => {
    const now = new Date().toISOString()
    registerUseCaseMock = {
      execute: jest.fn<RegisterUseCaseExecute>().mockResolvedValue({
        id: 'user-id-123',
        created_at: now,
        modified_at: now,
      }),
    }
    controller = new CreateUserController(registerUseCaseMock)
  })

  it('should return 201 with user data when user is created successfully', async () => {
    const response = await controller.handle({
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.body.id).toBe('user-id-123')
    expect(typeof response.body.created_at).toBe('string')
    expect(typeof response.body.modified_at).toBe('string')
    expect(registerUseCaseMock.execute).toHaveBeenCalledTimes(1)
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

    expect(registerUseCaseMock.execute).toHaveBeenCalledWith({
      email: expect.any(Email),
      name: expect.any(Name),
      password: expect.any(Password),
      telephones: expect.any(Array),
    })

    const calledWith = registerUseCaseMock.execute.mock.calls[0]?.[0]
    expect(calledWith?.email.getValue()).toBe('john@example.com')
    expect(calledWith?.name.getValue()).toBe('John Doe')
    expect(calledWith?.password.getValue()).toBe('password123')
    expect(calledWith?.telephones).toHaveLength(2)
    expect(calledWith?.telephones[0]).toBeInstanceOf(Telephone)
  })

  it('should return 409 when user already exists', async () => {
    registerUseCaseMock.execute.mockRejectedValueOnce(new UserAlreadyExists())

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
    const response = await controller.handle({
      body: {
        name: '',
        email: 'john@example.com',
        password: 'password123',
        telephones: [{ number: 987654321, area_code: 11 }],
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.errorMessage).toBe('Name is required')
    expect(registerUseCaseMock.execute).not.toHaveBeenCalled()
  })

  it('should return 400 when telephones array is empty', async () => {
    const response = await controller.handle({
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        telephones: [],
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.errorMessage).toBe(
      'At least one telephone is required'
    )
    expect(registerUseCaseMock.execute).not.toHaveBeenCalled()
  })

  it('should return 400 when value object throws error', async () => {
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
    expect(registerUseCaseMock.execute).not.toHaveBeenCalled()
  })

  it('should return 400 when generic error occurs in use case', async () => {
    registerUseCaseMock.execute.mockRejectedValueOnce(
      new Error('Database error')
    )

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
    registerUseCaseMock.execute.mockRejectedValueOnce('Unknown error')

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
