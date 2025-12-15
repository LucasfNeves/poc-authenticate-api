import { Email } from '../../src/domain/value-objects/Email';
describe('Email Value Object', () => {
    it('should create a valid email', () => {
        const email = Email.create('user@example.com');
        expect(email).toBeInstanceOf(Email);
        expect(email.getValue()).toBe('user@example.com');
    });
    it('should trim whitespace from email', () => {
        const email = Email.create('  user@example.com  ');
        expect(email.getValue()).toBe('user@example.com');
    });
    it('should throw error when email is empty', () => {
        expect(() => Email.create('')).toThrow('Email is required');
    });
    it('should throw error when email is only whitespace', () => {
        expect(() => Email.create('   ')).toThrow('Email is required');
    });
    test.each([
        'invalid-email',
        'user@',
        '@example.com',
        'user@domain',
        'userexample.com',
        'user @example.com',
    ])('should throw error for invalid email: %s', (invalidEmail) => {
        expect(() => Email.create(invalidEmail)).toThrow('Please provide a valid e-mail');
    });
    test.each([
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
        'test123@domain.co',
    ])('should accept valid email: %s', (validEmail) => {
        expect(() => Email.create(validEmail)).not.toThrow();
    });
    it('should compare two emails correctly', () => {
        const email1 = Email.create('user@example.com');
        const email2 = Email.create('user@example.com');
        const email3 = Email.create('other@example.com');
        expect(email1.equals(email2)).toBe(true);
        expect(email1.equals(email3)).toBe(false);
    });
    it('should convert to string', () => {
        const email = Email.create('user@example.com');
        expect(email.toString()).toBe('user@example.com');
    });
});
