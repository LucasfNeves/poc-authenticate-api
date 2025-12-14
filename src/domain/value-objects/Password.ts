import { ValidationError } from '../../shared/utils/errors'

export class Password {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(password: string): Password {
    if (!password) {
      throw new ValidationError('Password is required')
    }

    const trimmedPassword = password.trim()

    if (!trimmedPassword) {
      throw new ValidationError('Password is required')
    }

    if (trimmedPassword.length < 6) {
      throw new ValidationError('Password must have at least 6 characters')
    }

    return new Password(trimmedPassword)
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }
}
