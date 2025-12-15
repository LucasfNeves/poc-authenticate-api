import { ValidationError } from '../../shared/utils/errors';
export class Name {
    constructor(value) {
        this.value = value;
    }
    static create(name) {
        if (!name) {
            throw new ValidationError('Name is required');
        }
        const trimmedName = name.trim();
        if (!trimmedName) {
            throw new ValidationError('Name is required');
        }
        if (trimmedName.length < 2) {
            throw new ValidationError('Name must have at least 2 characters');
        }
        return new Name(trimmedName);
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value;
    }
}
