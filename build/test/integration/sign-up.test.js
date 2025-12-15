var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository';
import { SignupUseCase } from '../../src/application/usecase/sign-up';
import { UserAlreadyExists } from '../../src/shared/utils/errors';
describe('SignupUseCase', () => {
    let usersRepository;
    let signUpUseCase;
    const makeUserData = (overrides = {}) => {
        var _a, _b, _c;
        const name = (_a = overrides.name) !== null && _a !== void 0 ? _a : faker.person.fullName();
        const email = (_b = overrides.email) !== null && _b !== void 0 ? _b : faker.internet.email();
        const password = (_c = overrides.password) !== null && _c !== void 0 ? _c : faker.internet.password({ length: 8 });
        return {
            name,
            email,
            password,
            telephones: [{ number: 987654321, area_code: 11 }],
        };
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        usersRepository = new InMemoryUsersRepository();
        signUpUseCase = new SignupUseCase(usersRepository);
    }));
    it('should sign up a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = makeUserData();
        const result = yield signUpUseCase.execute(userData);
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.created_at).toBeDefined();
        expect(typeof result.created_at).toBe('string');
        expect(result.modified_at).toBeDefined();
        expect(typeof result.modified_at).toBe('string');
        expect(typeof result.id).toBe('string');
    }));
    it('should not sign up a user with an existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = makeUserData();
        yield signUpUseCase.execute(userData);
        yield expect(signUpUseCase.execute(userData)).rejects.toBeInstanceOf(UserAlreadyExists);
    }));
    it('should hash user password upon sign up', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = makeUserData();
        yield signUpUseCase.execute(userData);
        const storedUser = yield usersRepository.findByEmail(userData.email);
        expect(storedUser).toBeDefined();
        expect(storedUser.password).not.toBe(userData.password);
        const isPasswordValid = yield bcrypt.compare(userData.password, storedUser.password);
        expect(isPasswordValid).toBe(true);
    }));
    it('should throw ValidationError for invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = makeUserData({ email: 'invalid-email' });
        yield expect(signUpUseCase.execute(userData)).rejects.toThrow('Please provide a valid e-mail');
    }));
    it('should throw ValidationError for empty name', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = makeUserData({ name: '' });
        yield expect(signUpUseCase.execute(userData)).rejects.toThrow('Name is required');
    }));
    it('should throw ValidationError for short password', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = makeUserData({ password: '123' });
        yield expect(signUpUseCase.execute(userData)).rejects.toThrow('Password must have at least 6 characters');
    }));
});
