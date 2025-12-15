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
import { faker } from '@faker-js/faker';
import { SignInController } from '../../src/application/controller/sign-in';
import { InvalidCredentialsError, ValidationError, } from '../../src/shared/utils/errors';
describe('SignInController', () => {
    let signInUseCaseMock;
    let controller;
    const makeAuthData = (overrides = {}) => {
        var _a, _b;
        return {
            email: (_a = overrides.email) !== null && _a !== void 0 ? _a : faker.internet.email(),
            password: (_b = overrides.password) !== null && _b !== void 0 ? _b : faker.internet.password({ length: 8 }),
        };
    };
    beforeEach(() => {
        signInUseCaseMock = {
            execute: jest.fn().mockResolvedValue({
                accessToken: 'valid-jwt-token',
            }),
        };
        controller = new SignInController(signInUseCaseMock);
    });
    it('should return 200 with access token when credentials are valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const authData = makeAuthData();
        const response = yield controller.handle({
            body: authData,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.accessToken).toBe('valid-jwt-token');
        expect(signInUseCaseMock.execute).toHaveBeenCalledTimes(1);
    }));
    it('should call use case with correct parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const authData = makeAuthData();
        yield controller.handle({
            body: authData,
        });
        expect(signInUseCaseMock.execute).toHaveBeenCalledWith({
            email: authData.email,
            password: authData.password,
        });
    }));
    it('should return 401 when credentials are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        signInUseCaseMock.execute.mockRejectedValueOnce(new InvalidCredentialsError());
        const authData = makeAuthData();
        const response = yield controller.handle({
            body: authData,
        });
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Invalid credentials');
    }));
    it('should return 400 when validation fails for empty email', () => __awaiter(void 0, void 0, void 0, function* () {
        signInUseCaseMock.execute.mockRejectedValueOnce(new ValidationError('Email is required'));
        const authData = makeAuthData({ email: '' });
        const response = yield controller.handle({
            body: authData,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Email is required');
    }));
    it('should return 400 when validation fails for invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
        signInUseCaseMock.execute.mockRejectedValueOnce(new ValidationError('Please provide a valid e-mail'));
        const authData = makeAuthData({ email: 'invalid-email' });
        const response = yield controller.handle({
            body: authData,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Please provide a valid e-mail');
    }));
    it('should return 400 when validation fails for empty password', () => __awaiter(void 0, void 0, void 0, function* () {
        signInUseCaseMock.execute.mockRejectedValueOnce(new ValidationError('Password is required'));
        const authData = makeAuthData({ password: '' });
        const response = yield controller.handle({
            body: authData,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Password is required');
    }));
    it('should return 400 when validation error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        signInUseCaseMock.execute.mockRejectedValueOnce(new ValidationError('Invalid input'));
        const authData = makeAuthData();
        const response = yield controller.handle({
            body: authData,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Invalid input');
    }));
    it('should return 400 when generic Error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        signInUseCaseMock.execute.mockRejectedValueOnce(new Error('Some error message'));
        const authData = makeAuthData();
        const response = yield controller.handle({
            body: authData,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Some error message');
    }));
    it('should return 500 when unknown error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        signInUseCaseMock.execute.mockRejectedValueOnce('Unknown error');
        const authData = makeAuthData();
        const response = yield controller.handle({
            body: authData,
        });
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('errorMessage');
        expect(response.body.errorMessage).toBe('Internal server error');
    }));
});
