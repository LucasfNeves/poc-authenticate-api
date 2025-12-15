var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { InvalidCredentialsError, ValidationError, } from '../../shared/utils/errors';
import { badRequest, ok, serverError, unauthorized } from './helpers/http';
export class SignInController {
    constructor(signInUseCase) {
        this.signInUseCase = signInUseCase;
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = request.body;
                const { accessToken } = yield this.signInUseCase.execute({
                    email,
                    password,
                });
                return ok({ accessToken });
            }
            catch (error) {
                if (error instanceof ValidationError) {
                    return badRequest({
                        message: error.message,
                    });
                }
                if (error instanceof InvalidCredentialsError) {
                    return unauthorized({
                        message: error.message,
                    });
                }
                if (error instanceof Error) {
                    return badRequest({ message: error.message });
                }
                return serverError();
            }
        });
    }
}
