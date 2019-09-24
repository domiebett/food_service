import { BadRequestError } from './BadRequestError';

export class DuplicateEntryError extends BadRequestError {
    constructor(message) {
        super(message);
        this.code = 'DUPLICATE_ENTRY'
    }
}
