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
import { GetUserByIdController } from '../../src/application/controller/get-user-by-id-controller';
import { UserNotFoundError } from '../../src/shared/utils/errors';
describe('GetUserByIdController', () => {
    let getUserByIdUseCaseMock;
    let controller;
    const makeUserData = (overrides = {}) => {
        var _a;
        return {
            id: (_a = overrides.id) !== null && _a !== void 0 ? _a : faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            telephones: [{ area_code: 11, number: 987654321 }],
            created_at: faker.date.past().toISOString(),
            modified_at: faker.date.recent().toISOString()
        };
    };
    beforeEach(() => {
        getUserByIdUseCaseMock = {
            execute: jest.fn().mockResolvedValue({
                user: makeUserData()
            })
        };
        controller = new GetUserByIdController(getUserByIdUseCaseMock);
    });
    it('should return 401 when userId is not provided in metadata', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = {
            body: {},
            metadata: {}
        };
        const response = yield controller.handle(request);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ errorMessage: 'Invalid access token' });
    }));
    it('should return 200 with user data when user exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'valid-user-id';
        const userData = makeUserData({ id: userId });
        getUserByIdUseCaseMock.execute.mockResolvedValueOnce({ user: userData });
        const request = {
            body: {},
            metadata: { id: userId }
        };
        const response = yield controller.handle(request);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(userData);
        expect(getUserByIdUseCaseMock.execute).toHaveBeenCalledWith(userId);
        expect(getUserByIdUseCaseMock.execute).toHaveBeenCalledTimes(1);
    }));
    it('should return 401 when user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'non-existent-id';
        getUserByIdUseCaseMock.execute.mockRejectedValueOnce(new UserNotFoundError());
        const request = {
            body: {},
            metadata: { id: userId }
        };
        const response = yield controller.handle(request);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ errorMessage: 'User not found' });
    }));
    it('should return 500 when an unexpected error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'valid-user-id';
        getUserByIdUseCaseMock.execute.mockRejectedValueOnce(new Error('Database error'));
        const request = {
            body: {},
            metadata: { id: userId }
        };
        const response = yield controller.handle(request);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ errorMessage: 'Internal server error' });
    }));
    it('should call use case with correct userId from metadata', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'test-user-id';
        const userData = makeUserData({ id: userId });
        getUserByIdUseCaseMock.execute.mockResolvedValueOnce({ user: userData });
        const request = {
            body: {},
            metadata: { id: userId }
        };
        yield controller.handle(request);
        expect(getUserByIdUseCaseMock.execute).toHaveBeenCalledWith(userId);
        expect(getUserByIdUseCaseMock.execute).toHaveBeenCalledTimes(1);
    }));
});
