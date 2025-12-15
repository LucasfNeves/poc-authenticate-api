var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
export class AuthenticationMiddleware {
    handle(_a) {
        return __awaiter(this, arguments, void 0, function* ({ headers }) {
            const { authorization } = headers;
            if (!authorization) {
                return {
                    statusCode: 401,
                    body: { error: 'Unauthorized' },
                };
            }
            const [bearer, token] = authorization.split(' ');
            try {
                if (bearer !== 'Bearer') {
                    return {
                        statusCode: 401,
                        body: { error: 'Unauthorized' },
                    };
                }
                const payload = jwt.verify(token, env.jwtSecret);
                const { sub } = payload;
                if (!(sub === null || sub === void 0 ? void 0 : sub.id)) {
                    return {
                        statusCode: 401,
                        body: { error: 'Invalid Token' },
                    };
                }
                return {
                    data: {
                        id: sub.id,
                        email: sub.email,
                    },
                };
            }
            catch (_b) {
                return {
                    statusCode: 401,
                    body: { error: 'Unauthorized' },
                };
            }
        });
    }
}
