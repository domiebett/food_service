import { BadRequestError } from './BadRequestError';
import { ValidationError as ValidationException } from 'class-validator';

export class ValidationError extends BadRequestError {
    errors: ValidationException[];

    constructor(errors, message = null) {
        super(message || 'Validation error! Check the "errors" field for more details.');
        this.errors = errors;
        this.code = 'VALIDATION_ERROR';
    }
}
