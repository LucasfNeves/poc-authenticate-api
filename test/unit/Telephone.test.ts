import { describe, it, expect } from '@jest/globals'
import { Telephone } from '../../src/domain/value-objects/Telephone'

describe('Telephone Value Object', () => {
  describe('create', () => {
    it('should create a valid telephone with 8 digits', () => {
      const telephone = Telephone.create(12345678, 11)

      expect(telephone.getNumber()).toBe(12345678)
      expect(telephone.getAreaCode()).toBe(11)
    })

    it('should create a valid telephone with 9 digits', () => {
      const telephone = Telephone.create(987654321, 21)

      expect(telephone.getNumber()).toBe(987654321)
      expect(telephone.getAreaCode()).toBe(21)
    })

    it('should return correct value object', () => {
      const telephone = Telephone.create(987654321, 11)

      const value = telephone.getValue()

      expect(value).toEqual({
        number: 987654321,
        area_code: 11,
      })
    })
  })

  describe('validation', () => {
    it('should throw error when number is not an integer', () => {
      expect(() => Telephone.create(123.45, 11)).toThrow(
        'Phone number must be a positive integer'
      )
    })

    it('should throw error when number is negative', () => {
      expect(() => Telephone.create(-12345678, 11)).toThrow(
        'Phone number must be a positive integer'
      )
    })

    it('should throw error when number is zero', () => {
      expect(() => Telephone.create(0, 11)).toThrow(
        'Phone number must be a positive integer'
      )
    })

    it('should throw error when number has less than 8 digits', () => {
      expect(() => Telephone.create(1234567, 11)).toThrow(
        'Phone number must have exactly 8 or 9 digits'
      )
    })

    it('should throw error when number has more than 9 digits', () => {
      expect(() => Telephone.create(1234567890, 11)).toThrow(
        'Phone number must have exactly 8 or 9 digits'
      )
    })

    it('should throw error when area code is not an integer', () => {
      expect(() => Telephone.create(12345678, 11.5)).toThrow(
        'Area code must be a positive integer'
      )
    })

    it('should throw error when area code is negative', () => {
      expect(() => Telephone.create(12345678, -11)).toThrow(
        'Area code must be a positive integer'
      )
    })

    it('should throw error when area code is zero', () => {
      expect(() => Telephone.create(12345678, 0)).toThrow(
        'Area code must be a positive integer'
      )
    })

    it('should throw error when area code has less than 2 digits', () => {
      expect(() => Telephone.create(12345678, 1)).toThrow(
        'Area code must have exactly 2 digits'
      )
    })

    it('should throw error when area code has more than 2 digits', () => {
      expect(() => Telephone.create(12345678, 111)).toThrow(
        'Area code must have exactly 2 digits'
      )
    })
  })
})
