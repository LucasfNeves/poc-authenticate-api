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
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetUserByIdUseCase } from '../../src/application/usecase/get-user-by-id';
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository';
import { UserNotFoundError } from '../../src/shared/utils/errors';
import { BCRYPT_SALT_ROUNDS } from '../../src/config/constant';
import bcrypt from 'bcrypt';
describe('GetUserByIdUseCase', () => {
    let usersRepository;
    let getUserByIdUseCase;
    const createUser = () => __awaiter(void 0, void 0, void 0, function* () {
        const email = faker.internet.email();
        const name = faker.person.fullName();
        const password = faker.internet.password({ length: 10 });
        const hashedPassword = yield bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        const user = yield usersRepository.create({
            name,
            email,
            password: hashedPassword,
            telephones: [{ number: 987654321, area_code: 11 }],
        });
        return { id: user.id, email, name };
    });
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        getUserByIdUseCase = new GetUserByIdUseCase(usersRepository);
    });
    it('should get user by id successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const { id, email, name } = yield createUser();
        const result = yield getUserByIdUseCase.execute(id);
        expect(result.user).toEqual(expect.objectContaining({
            id,
            email,
            name,
        }));
    }));
    it('should call repository findById with correct id', () => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = yield createUser();
        const findByIdSpy = jest.spyOn(usersRepository, 'findById');
        yield getUserByIdUseCase.execute(id);
        expect(findByIdSpy).toHaveBeenCalledWith(id);
        expect(findByIdSpy).toHaveBeenCalledTimes(1);
    }));
    it('should throw UserNotFoundError when user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentId = 'non-existent-id';
        yield expect(getUserByIdUseCase.execute(nonExistentId)).rejects.toBeInstanceOf(UserNotFoundError);
    }));
    it('should throw error when repository fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = yield createUser();
        jest
            .spyOn(usersRepository, 'findById')
            .mockRejectedValueOnce(new Error('Database connection failed'));
        yield expect(getUserByIdUseCase.execute(id)).rejects.toThrow('Database connection failed');
    }));
});
