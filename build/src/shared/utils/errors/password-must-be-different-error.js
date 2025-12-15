export class PasswordMustBeDifferentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PasswordMustBeDifferentError';
    }
}
