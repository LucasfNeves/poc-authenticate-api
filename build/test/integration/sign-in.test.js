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
import { SignInUseCase } from '../../src/application/usecase/sign-in';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { InvalidCredentialsError } from '../../src/shared/utils/errors';
import { BCRYPT_SALT_ROUNDS } from '../../src/config/constant';
describe('SignInUseCase', () => {
    let usersRepository;
    let jwtAdapter;
    let jwtSignSpy;
    let signInUseCase;
    const createUser = () => __awaiter(void 0, void 0, void 0, function* () {
        const email = faker.internet.email();
        const password = faker.internet.password({ length: 10 });
        const hashedPassword = yield bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        const user = yield usersRepository.create({
            name: faker.person.fullName(),
            email,
            password: hashedPassword,
            telephones: [{ number: 987654321, area_code: 11 }],
        });
        return { email, password, user };
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        usersRepository = new InMemoryUsersRepository();
        jwtSignSpy = jest.fn().mockReturnValue('fake-jwt-token');
        jwtAdapter = {
            sign: jwtSignSpy,
        };
        signInUseCase = new SignInUseCase(usersRepository, jwtAdapter);
    }));
    it('should be able to sign in', () => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = yield createUser();
        const { accessToken } = yield signInUseCase.execute({
            email,
            password,
        });
        expect(accessToken).toBeTruthy();
    }));
    it('should include email and id in JWT token payload', () => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password, user } = yield createUser();
        yield signInUseCase.execute({
            email,
            password,
        });
        expect(jwtSignSpy).toHaveBeenCalledTimes(1);
        const [payload] = jwtSignSpy.mock.calls[0];
        expect(payload).toEqual(expect.objectContaining({
            sub: expect.objectContaining({
                email,
                id: user.id,
            }),
        }));
    }));
    it('should not sign in with wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = yield createUser();
        const promise = signInUseCase.execute({
            email,
            password: 'wrong-password',
        });
        yield expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError);
    }));
    it('should not sign in with non existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = faker.internet.email();
        const password = faker.internet.password({ length: 10 });
        const promise = signInUseCase.execute({
            email,
            password,
        });
        yield expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError);
    }));
    it('should not sign in with wrong email', () => __awaiter(void 0, void 0, void 0, function* () {
        const { password } = yield createUser();
        const email = faker.internet.email();
        const promise = signInUseCase.execute({
            email,
            password,
        });
        yield expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError);
    }));
});
