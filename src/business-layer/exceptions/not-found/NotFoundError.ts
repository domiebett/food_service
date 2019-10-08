import { BaseError } from "../BaseError";

export class NotFoundError extends BaseError {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.code = 'NOT_FOUND';
        this.status = 404;
    }
}
