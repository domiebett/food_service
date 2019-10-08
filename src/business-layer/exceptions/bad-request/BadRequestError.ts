import { BaseError } from '../BaseError';

export class BadRequestError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.status = 400;
        this.code = 'BAD_REQUEST'
    }
}
