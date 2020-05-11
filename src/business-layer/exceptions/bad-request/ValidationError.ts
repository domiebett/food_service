import { BadRequestError } from './BadRequestError';
import { ValidationError as ValidationException } from 'class-validator';

export class ValidationError extends BadRequestError {
    errors: any[];

    constructor(errors, message = "Validation error! Check the 'errors' field for more details.") {
        super(message);
        this.code = 'VALIDATION_ERROR';
        this.errors = ValidationError.formatErrorMessage(errors);
    }

    static formatErrorMessage(errors) {
        if (!(Array.isArray(errors))) return errors;

        return errors.map((error) => {
            return error.property ? {
                field: error.property,
                messages: ValidationError.getMessages(error)
            } : error;
        });
    }

    static getMessages(error) {
        let messages = [];
        for (let key in error.constraints) {
            messages.push(error.constraints[key]);
        }
        return messages;
    }
}
