var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { badRequest, conflict, created, serverError } from './helpers/http';
import { UserAlreadyExists, ValidationError } from '../../shared/utils/errors';
export class SignupController {
    constructor(signupUserUseCase) {
        this.signupUserUseCase = signupUserUseCase;
    }
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ body }) {
            try {
                const { email, name, password, telephones } = body;
                const telephonesData = !telephones
                    ? []
                    : telephones.map((tel) => ({
                        number: Number(tel.number),
                        area_code: Number(tel.area_code),
                    }));
                const { id, created_at, modified_at } = yield this.signupUserUseCase.execute({
                    email,
                    name,
                    password,
                    telephones: telephonesData,
                });
                return created({ id, created_at, modified_at });
            }
            catch (error) {
                if (error instanceof ValidationError) {
                    return badRequest({
                        message: error.message,
                    });
                }
                if (error instanceof UserAlreadyExists) {
                    return conflict({
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
