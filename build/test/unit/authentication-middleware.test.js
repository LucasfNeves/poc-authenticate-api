var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { AuthenticationMiddleware } from '../../src/application/middlewares/AuthenticationMiddleware';
describe('AuthenticationMiddleware', () => {
    let middleware;
    const secret = 'test-secret-key';
    beforeEach(() => {
        middleware = new AuthenticationMiddleware();
        process.env.JWT_SECRET = secret;
    });
    it('should return 401 when authorization header is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { headers: {} };
        const result = yield middleware.handle(request);
        expect(result).toEqual({
            statusCode: 401,
            body: { error: 'Unauthorized' }
        });
    }));
    it('should return 401 when authorization header is not Bearer', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { headers: { authorization: 'Basic token123' } };
        const result = yield middleware.handle(request);
        expect(result).toEqual({
            statusCode: 401,
            body: { error: 'Unauthorized' }
        });
    }));
    it('should return 401 when token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { headers: { authorization: 'Bearer invalid-token' } };
        const result = yield middleware.handle(request);
        expect(result).toEqual({
            statusCode: 401,
            body: { error: 'Unauthorized' }
        });
    }));
    it('should return 401 when token has invalid signature', () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { sub: { id: 'user-123' } };
        const token = jwt.sign(payload, 'wrong-secret');
        const request = { headers: { authorization: `Bearer ${token}` } };
        const result = yield middleware.handle(request);
        expect(result).toEqual({
            statusCode: 401,
            body: { error: 'Unauthorized' }
        });
    }));
    it('should handle token without Bearer prefix', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { headers: { authorization: 'token123' } };
        const result = yield middleware.handle(request);
        expect(result).toEqual({
            statusCode: 401,
            body: { error: 'Unauthorized' }
        });
    }));
    it('should return 401 for any JWT verification error', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { headers: { authorization: 'Bearer expired.or.invalid.token' } };
        const result = yield middleware.handle(request);
        expect(result).toEqual({
            statusCode: 401,
            body: { error: 'Unauthorized' }
        });
    }));
});
