import { ValidationError } from '../../shared/utils/errors'

export class Name {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(name: string): Name {
    if (!name) {
      throw new ValidationError('Name is required')
    }

    const trimmedName = name.trim()

    if (!trimmedName) {
      throw new ValidationError('Name is required')
    }

    if (trimmedName.length < 2) {
      throw new ValidationError('Name must have at least 2 characters')
    }

    return new Name(trimmedName)
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }
}
