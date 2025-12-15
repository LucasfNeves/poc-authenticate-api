import { ValidationError } from '../../shared/utils/errors';
export class Telephone {
    constructor(number, areaCode) {
        this.number = number;
        this.areaCode = areaCode;
    }
    static create(number, areaCode) {
        this.validate(number, areaCode);
        return new Telephone(number, areaCode);
    }
    static createMany(telephones) {
        if (!telephones || !Array.isArray(telephones) || telephones.length === 0) {
            throw new ValidationError('At least one telephone is required');
        }
        return telephones.map((tel) => this.create(tel.number, tel.area_code));
    }
    static validate(number, areaCode) {
        if (number === undefined || number === null || isNaN(number)) {
            throw new ValidationError('Phone number is required');
        }
        if (areaCode === undefined || areaCode === null || isNaN(areaCode)) {
            throw new ValidationError('Area code is required');
        }
        if (!Number.isInteger(number) || number <= 0) {
            throw new ValidationError('Phone number must be a positive integer');
        }
        if (!Number.isInteger(areaCode) || areaCode <= 0) {
            throw new ValidationError('Area code must be a positive integer');
        }
        const numberStr = number.toString();
        if (numberStr.length !== 8 && numberStr.length !== 9) {
            throw new ValidationError('Phone number must have exactly 8 or 9 digits');
        }
        const areaCodeStr = areaCode.toString();
        if (areaCodeStr.length !== 2) {
            throw new ValidationError('Area code must have exactly 2 digits');
        }
    }
    getNumber() {
        return this.number;
    }
    getAreaCode() {
        return this.areaCode;
    }
    getValue() {
        return {
            number: this.number,
            area_code: this.areaCode,
        };
    }
}
