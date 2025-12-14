import { Password } from '../../src/domain/value-objects/Password'

describe('Password Value Object', () => {
  it('should create a valid password', () => {
    const password = Password.create('mypassword123')

    expect(password).toBeInstanceOf(Password)
    expect(password.getValue()).toBe('mypassword123')
  })

  it('should trim whitespace from password', () => {
    const password = Password.create('  password123  ')

    expect(password.getValue()).toBe('password123')
  })

  it('should throw error when password is empty', () => {
    expect(() => Password.create('')).toThrow('Password is required')
  })

  it('should throw error when password is only whitespace', () => {
    expect(() => Password.create('   ')).toThrow('Password is required')
  })

  test.each(['12345', 'abc', 'a', '12'])(
    'should throw error for password with less than 6 characters: %s',
    (shortPassword) => {
      expect(() => Password.create(shortPassword)).toThrow(
        'Password must have at least 6 characters'
      )
    }
  )

  test.each(['123456', '1234567', 'verylongpassword123', 'P@ssw0rd!'])(
    'should accept valid password: %s',
    (validPassword) => {
      expect(() => Password.create(validPassword)).not.toThrow()
    }
  )

  it('should accept password with special characters', () => {
    const password = Password.create('P@ssw0rd!')

    expect(password.getValue()).toBe('P@ssw0rd!')
  })

  it('should convert to string', () => {
    const password = Password.create('mypassword')

    expect(password.toString()).toBe('mypassword')
  })
})
