export class Password {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(password: string): Password {
    const trimmedPassword = password.trim()

    if (!trimmedPassword) {
      throw new Error('Password is required')
    }

    if (trimmedPassword.length < 6) {
      throw new Error('Password must have at least 6 characters')
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
