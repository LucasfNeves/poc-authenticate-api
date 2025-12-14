export class Telephone {
  private constructor(
    private readonly number: number,
    private readonly areaCode: number
  ) {}

  static create(number: number, areaCode: number): Telephone {
    this.validate(number, areaCode)
    return new Telephone(number, areaCode)
  }

  private static validate(number: number, areaCode: number): void {
    if (!Number.isInteger(number) || number <= 0) {
      throw new Error('Phone number must be a positive integer')
    }

    if (!Number.isInteger(areaCode) || areaCode <= 0) {
      throw new Error('Area code must be a positive integer')
    }

    const numberStr = number.toString()
    if (numberStr.length < 8 || numberStr.length > 9) {
      throw new Error('Phone number must have 8 or 9 digits')
    }

    const areaCodeStr = areaCode.toString()
    if (areaCodeStr.length !== 2) {
      throw new Error('Area code must have exactly 2 digits')
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
