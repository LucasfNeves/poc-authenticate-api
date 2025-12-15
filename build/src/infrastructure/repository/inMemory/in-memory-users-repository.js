var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { randomUUID } from 'crypto';
export class InMemoryUsersRepository {
    constructor() {
        this.items = [];
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.items.find((user) => user.email === email);
            return user || null;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const user = {
                id: randomUUID(),
                name: data.name,
                email: data.email,
                password: data.password,
                telephones: data.telephones || [],
                createdAt: now,
                updatedAt: now,
                toJSON: () => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    telephones: user.telephones,
                    created_at: now.toISOString(),
                    updated_at: now.toISOString(),
                }),
            };
            this.items.push(user);
            return user;
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.items.find((user) => user.id === userId);
            if (!user) {
                return null;
            }
            const userJson = user.toJSON();
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                telephones: user.telephones,
                createdAt: userJson.created_at,
                updatedAt: userJson.updated_at,
            };
        });
    }
}
