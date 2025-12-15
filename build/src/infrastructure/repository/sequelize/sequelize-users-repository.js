var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../../database/models/User';
export class SequelizeUsersRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.findOne({
                where: { email },
            });
            return user;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.create({
                name: data.name,
                email: data.email,
                password: data.password,
                telephones: data.telephones || [],
            });
            return user;
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.findByPk(userId);
            if (!user) {
                return null;
            }
            const { id, name, email, telephones, created_at, updated_at } = user.toJSON();
            return {
                id,
                name,
                email,
                telephones,
                createdAt: created_at,
                updatedAt: updated_at,
            };
        });
    }
}
