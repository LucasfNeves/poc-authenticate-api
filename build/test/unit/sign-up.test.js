var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SignupController } from '../../src/application/controller/sign-up';
import { UserAlreadyExists, ValidationError, } from '../../src/shared/utils/errors';
describe('CreateUserController', () => {
    let signUpUseCaseMock;
    let controller;
    beforeEach(() => {
        const now = new Date().toISOString();
        signUpUseCaseMock = {
            execute: jest.fn().mockResolvedValue({
                id: 'user-id-123',
                created_at: now,
                modified_at: now,
            }),
        };
        controller = new SignupController(signUpUseCaseMock);
    });
    it('should return 200 with user data when user is created successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield controller.handle({
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                telephones: [{ number: 987654321, area_code: 11 }],
            },
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe('user-id-123');
        expect(typeof response.body.created_at).toBe('string');
        expect(typeof response.body.modified_at).toBe('string');
        expect(signUpUseCaseMock.execute).toHaveBeenCalledTimes(1);
    }));
    it('should call use case with correct value objects including telephones', () => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.handle({
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                telephones: [
                    { number: 987654321, area_code: 11 },
                    { number: 12345678, area_code: 21 },
                ],
            },
        });
        expect(signUpUseCaseMock.execute).toHaveBeenCalledWith({
            email: 'john@example.com',
            name: 'John Doe',
            password: 'password123',
            telephones: [
                { number: 987654321, area_code: 11 },
                { number: 12345678, area_code: 21 },
            ],
        });
    }));
    it('should return 409 when user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        signUpUseCaseMock.execute.mockRejectedValueOnce(new UserAlreadyExists());
        const response = yield controller.handle({
            body: {
                name: 'John Doe',
                email: 'existing@example.com',
                password: 'password123',
                telephones: [{ number: 987654321, area_code: 11 }],
            },
        });
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe('User already exists');
    }));
    it('should return 400 when validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        signUpUseCaseMock.execute.mockRejectedValueOnce(new ValidationError('Name is required'));
        const response = yield controller.handle({
            body: {
                name: '',
                email: 'john@example.com',
                password: 'password123',
                telephones: [{ number: 987654321, area_code: 11 }],
            },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Name is required');
    }));
    it('should return 400 when telephones array is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        signUpUseCaseMock.execute.mockRejectedValueOnce(new ValidationError('At least one telephone is required'));
        const response = yield controller.handle({
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                telephones: [],
            },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('At least one telephone is required');
    }));
    it('should return 400 when value object throws error', () => __awaiter(void 0, void 0, void 0, function* () {
        signUpUseCaseMock.execute.mockRejectedValueOnce(new ValidationError('Name must have at least 2 characters'));
        const response = yield controller.handle({
            body: {
                name: 'J',
                email: 'john@example.com',
                password: 'password123',
                telephones: [{ number: 987654321, area_code: 11 }],
            },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain('at least 2 characters');
    }));
    it('should return 400 when generic error occurs in use case', () => __awaiter(void 0, void 0, void 0, function* () {
        signUpUseCaseMock.execute.mockRejectedValueOnce(new Error('Database error'));
        const response = yield controller.handle({
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                telephones: [{ number: 987654321, area_code: 11 }],
            },
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Database error');
    }));
    it('should return 500 when unknown error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        signUpUseCaseMock.execute.mockRejectedValueOnce('Unknown error');
        const response = yield controller.handle({
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                telephones: [{ number: 987654321, area_code: 11 }],
            },
        });
        expect(response.statusCode).toBe(500);
        expect(response.body.errorMessage).toBe('Internal server error');
    }));
});
