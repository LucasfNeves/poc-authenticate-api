import { Name } from '../../src/domain/value-objects/Name'

describe('Name Value Object', () => {
  it('should create a valid name', () => {
    const name = Name.create('John Doe')

    expect(name).toBeInstanceOf(Name)
    expect(name.getValue()).toBe('John Doe')
  })

  it('should trim whitespace from name', () => {
    const name = Name.create('  John Doe  ')

    expect(name.getValue()).toBe('John Doe')
  })

  it('should throw error when name is empty', () => {
    expect(() => Name.create('')).toThrow('Name is required')
  })

  it('should throw error when name is only whitespace', () => {
    expect(() => Name.create('   ')).toThrow('Name is required')
  })

  it('should throw error when name is less than 2 characters', () => {
    expect(() => Name.create('A')).toThrow(
      'Name must have at least 2 characters'
    )
  })

  test.each([
    'Ab',
    'John',
    'John Doe',
    'John Doe Smith',
    "O'Connor",
    'José María',
    'Marie-Claire',
  ])('should accept valid name: %s', (validName) => {
    const name = Name.create(validName)
    expect(name.getValue()).toBe(validName)
  })

  it('should convert to string', () => {
    const name = Name.create('John Doe')

    expect(name.toString()).toBe('John Doe')
  })
})
