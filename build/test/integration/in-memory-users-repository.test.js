var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { InMemoryUsersRepository } from '../../src/infrastructure/repository/inMemory/in-memory-users-repository';
import { faker } from '@faker-js/faker';
describe('InMemoryUsersRepository - Integration', () => {
    let repository;
    beforeEach(() => {
        repository = new InMemoryUsersRepository();
    });
    it('should create user and find by email', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
            telephones: [{ number: 987654321, area_code: 11 }],
        };
        const createdUser = yield repository.create(userData);
        const foundByEmail = yield repository.findByEmail(userData.email);
        expect(foundByEmail).not.toBeNull();
        expect(foundByEmail === null || foundByEmail === void 0 ? void 0 : foundByEmail.id).toBe(createdUser.id);
        expect(foundByEmail === null || foundByEmail === void 0 ? void 0 : foundByEmail.email).toBe(userData.email);
    }));
    it('should create user and find by id returning public data only', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
            telephones: [{ number: 987654321, area_code: 11 }],
        };
        const createdUser = yield repository.create(userData);
        const foundById = yield repository.findById(createdUser.id);
        expect(foundById).not.toBeNull();
        expect(foundById === null || foundById === void 0 ? void 0 : foundById.id).toBe(createdUser.id);
        expect(foundById === null || foundById === void 0 ? void 0 : foundById.email).toBe(userData.email);
        expect(foundById).not.toHaveProperty('password');
    }));
    it('should generate unique IDs for multiple users', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield Promise.all(Array.from({ length: 3 }, () => repository.create({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            telephones: [{ number: 987654321, area_code: 11 }],
        })));
        const ids = users.map((u) => u.id);
        expect(new Set(ids).size).toBe(3);
    }));
    it('should find correct user among multiple users', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield Promise.all(Array.from({ length: 3 }, () => repository.create({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            telephones: [{ number: 987654321, area_code: 11 }],
        })));
        const foundUser = yield repository.findByEmail(users[1].email);
        expect(foundUser).not.toBeNull();
        expect(foundUser === null || foundUser === void 0 ? void 0 : foundUser.id).toBe(users[1].id);
    }));
});
