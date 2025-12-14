import { ValidationError } from '../../shared/utils/errors'

export class Telephone {
  private constructor(
    private readonly number: number,
    private readonly areaCode: number
  ) {}

  static create(number: number, areaCode: number): Telephone {
    this.validate(number, areaCode)
    return new Telephone(number, areaCode)
  }

  static createMany(
    telephones: Array<{ number: number; area_code: number }>
  ): Telephone[] {
    if (!telephones || !Array.isArray(telephones) || telephones.length === 0) {
      throw new ValidationError('At least one telephone is required')
    }

    return telephones.map((tel) => this.create(tel.number, tel.area_code))
  }

  private static validate(number: number, areaCode: number): void {
    if (number === undefined || number === null || isNaN(number)) {
      throw new ValidationError('Phone number is required')
    }

    if (areaCode === undefined || areaCode === null || isNaN(areaCode)) {
      throw new ValidationError('Area code is required')
    }

    if (!Number.isInteger(number) || number <= 0) {
      throw new ValidationError('Phone number must be a positive integer')
    }

    if (!Number.isInteger(areaCode) || areaCode <= 0) {
      throw new ValidationError('Area code must be a positive integer')
    }

    const numberStr = number.toString()
    if (numberStr.length !== 8 && numberStr.length !== 9) {
      throw new ValidationError('Phone number must have exactly 8 or 9 digits')
    }

    const areaCodeStr = areaCode.toString()
    if (areaCodeStr.length !== 2) {
      throw new ValidationError('Area code must have exactly 2 digits')
    }
  }

  getNumber(): number {
    return this.number
  }

  getAreaCode(): number {
    return this.areaCode
  }

  getValue(): { number: number; area_code: number } {
    return {
      number: this.number,
      area_code: this.areaCode,
    }
  }
}
