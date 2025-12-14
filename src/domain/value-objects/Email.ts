export class Email {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(email: string): Email {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      throw new Error('Email is required')
    }

    if (!this.isValid(trimmedEmail)) {
      throw new Error('Please provide a valid e-mail')
    }

    return new Email(trimmedEmail)
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  getValue(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
