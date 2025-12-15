import { ValidationError } from '../../shared/utils/errors';
export class Email {
    constructor(value) {
        this.value = value;
    }
    static create(email) {
        if (!email) {
            throw new ValidationError('Email is required');
        }
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            throw new ValidationError('Email is required');
        }
        if (!this.isValid(trimmedEmail)) {
            throw new ValidationError('Please provide a valid e-mail');
        }
        return new Email(trimmedEmail);
    }
    static isValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
