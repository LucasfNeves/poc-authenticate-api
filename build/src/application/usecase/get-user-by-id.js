var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserNotFoundError } from '../../shared/utils/errors';
export class GetUserByIdUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findById(userId);
            if (!user) {
                throw new UserNotFoundError();
            }
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    telephones: user.telephones || [],
                    created_at: user.createdAt,
                    modified_at: user.updatedAt,
                },
            };
        });
    }
}
