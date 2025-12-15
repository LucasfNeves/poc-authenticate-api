import jwt from 'jsonwebtoken';
import { env } from '../config/env';
export class JwtAdapterImpl {
    sign(payload, expiresIn) {
        if (!env.jwtSecret) {
            throw new Error('JWT secret is not defined');
        }
        return jwt.sign(payload, env.jwtSecret, { expiresIn });
    }
}
