var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { compare } from 'bcrypt';
import { ACCESS_TOKEN_EXPIRATION } from '../../config/constant';
import { InvalidCredentialsError } from '../../shared/utils/errors';
import { Email, Password } from '../../domain/value-objects';
export class SignInUseCase {
    constructor(usersRepository, jwtAdapter) {
        this.usersRepository = usersRepository;
        this.jwtAdapter = jwtAdapter;
    }
    generateTokens(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = this.jwtAdapter.sign({ sub: payload }, ACCESS_TOKEN_EXPIRATION);
            return { accessToken };
        });
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, }) {
            const emailVO = Email.create(email);
            const passwordVO = Password.create(password);
            const user = yield this.usersRepository.findByEmail(emailVO.getValue());
            if (!user) {
                throw new InvalidCredentialsError();
            }
            const doesPasswordMatches = yield compare(passwordVO.getValue(), user.password);
            if (!doesPasswordMatches) {
                throw new InvalidCredentialsError();
            }
            const { accessToken } = yield this.generateTokens({
                id: user.id,
                email: user.email,
            });
            return { accessToken };
        });
    }
}
