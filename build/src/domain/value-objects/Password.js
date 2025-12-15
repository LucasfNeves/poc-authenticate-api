import { ValidationError } from '../../shared/utils/errors';
export class Password {
    constructor(value) {
        this.value = value;
    }
    static create(password) {
        if (!password) {
            throw new ValidationError('Password is required');
        }
        const trimmedPassword = password.trim();
        if (!trimmedPassword) {
            throw new ValidationError('Password is required');
        }
        if (trimmedPassword.length < 6) {
            throw new ValidationError('Password must have at least 6 characters');
        }
        return new Password(trimmedPassword);
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value;
    }
}
