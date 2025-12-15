var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import { UserAlreadyExists } from '../../shared/utils/errors';
import { BCRYPT_SALT_ROUNDS } from '../../config/constant';
import { Email, Name, Password, Telephone } from '../../domain/value-objects';
export class SignupUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, telephones } = params;
            const emailVO = Email.create(email);
            const nameVO = Name.create(name);
            const passwordVO = Password.create(password);
            const telephonesVO = Telephone.createMany(telephones);
            const hasedPassword = yield bcrypt.hash(passwordVO.getValue(), BCRYPT_SALT_ROUNDS);
            const userWithSameEmail = yield this.usersRepository.findByEmail(emailVO.getValue());
            if (userWithSameEmail) {
                throw new UserAlreadyExists();
            }
            const telephonesData = telephonesVO.map((tel) => tel.getValue());
            const createdUser = yield this.usersRepository.create({
                name: nameVO.getValue(),
                email: emailVO.getValue(),
                password: hasedPassword,
                telephones: telephonesData,
            });
            const userJson = createdUser.toJSON();
            return {
                id: createdUser.id,
                created_at: userJson.created_at,
                modified_at: userJson.updated_at,
            };
        });
    }
}
