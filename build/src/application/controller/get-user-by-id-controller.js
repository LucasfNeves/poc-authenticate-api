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
import { ok, serverError, unauthorized } from './helpers/http';
export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase;
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = request.metadata) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return unauthorized({ errorMessage: 'Invalid access token' });
                }
                const { user } = yield this.getUserByIdUseCase.execute(userId);
                return ok(user);
            }
            catch (error) {
                if (error instanceof UserNotFoundError) {
                    return unauthorized({ errorMessage: 'User not found' });
                }
                return serverError();
            }
        });
    }
}
