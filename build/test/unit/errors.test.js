import { describe, it, expect } from '@jest/globals';
import { InvalidCredentialsError } from '../../src/shared/utils/errors/Invalid-credentials-error';
import { EmailAlreadyInUseError } from '../../src/shared/utils/errors/email-already-in-use';
import { NotFoundException } from '../../src/shared/utils/errors/not-found-exception';
import { PasswordMustBeDifferentError } from '../../src/shared/utils/errors/password-must-be-different-error';
import { UserNotFoundError } from '../../src/shared/utils/errors/user-not-found-error';
describe('Error Classes', () => {
    describe('InvalidCredentialsError', () => {
        it('should create an error with correct message and name', () => {
            const error = new InvalidCredentialsError();
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(InvalidCredentialsError);
            expect(error.message).toBe('Invalid credentials');
            expect(error.name).toBe('InvalidCredentialsError');
        });
        it('should be throwable and catchable', () => {
            expect(() => {
                throw new InvalidCredentialsError();
            }).toThrow(InvalidCredentialsError);
        });
    });
    describe('EmailAlreadyInUseError', () => {
        it('should create an error with correct message and name', () => {
            const email = 'test@example.com';
            const error = new EmailAlreadyInUseError(email);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(EmailAlreadyInUseError);
            expect(error.message).toBe(`The provided e-mail ${email} is already in use`);
            expect(error.name).toBe('EmailAlreadyInUseError');
        });
        it('should include the email in the error message', () => {
            const email = 'user@domain.com';
            const error = new EmailAlreadyInUseError(email);
            expect(error.message).toContain(email);
        });
        it('should be throwable and catchable', () => {
            expect(() => {
                throw new EmailAlreadyInUseError('test@test.com');
            }).toThrow(EmailAlreadyInUseError);
        });
    });
    describe('NotFoundException', () => {
        it('should create an error with correct message and name', () => {
            const message = 'Resource not found';
            const error = new NotFoundException(message);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toBe(message);
            expect(error.name).toBe('NotFoundException');
        });
        it('should accept custom messages', () => {
            const customMessage = 'User with ID 123 not found';
            const error = new NotFoundException(customMessage);
            expect(error.message).toBe(customMessage);
        });
        it('should be throwable and catchable', () => {
            expect(() => {
                throw new NotFoundException('Not found');
            }).toThrow(NotFoundException);
        });
    });
    describe('PasswordMustBeDifferentError', () => {
        it('should create an error with correct message and name', () => {
            const message = 'New password must be different from the old one';
            const error = new PasswordMustBeDifferentError(message);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(PasswordMustBeDifferentError);
            expect(error.message).toBe(message);
            expect(error.name).toBe('PasswordMustBeDifferentError');
        });
        it('should accept custom messages', () => {
            const customMessage = 'Password cannot be the same as before';
            const error = new PasswordMustBeDifferentError(customMessage);
            expect(error.message).toBe(customMessage);
        });
        it('should be throwable and catchable', () => {
            expect(() => {
                throw new PasswordMustBeDifferentError('Different password required');
            }).toThrow(PasswordMustBeDifferentError);
        });
    });
    describe('UserNotFoundError', () => {
        it('should create an error with default message and name', () => {
            const error = new UserNotFoundError();
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(UserNotFoundError);
            expect(error.message).toBe('Usuário não encontrado');
            expect(error.name).toBe('UserNotFoundError');
        });
        it('should accept custom message', () => {
            const customMessage = 'User with email not found';
            const error = new UserNotFoundError(customMessage);
            expect(error.message).toBe(customMessage);
            expect(error.name).toBe('UserNotFoundError');
        });
        it('should be throwable and catchable', () => {
            expect(() => {
                throw new UserNotFoundError();
            }).toThrow(UserNotFoundError);
        });
        it('should be catchable with custom message', () => {
            expect(() => {
                throw new UserNotFoundError('Custom not found message');
            }).toThrow('Custom not found message');
        });
    });
});
