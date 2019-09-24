import { NotFoundError } from "./NotFoundError";

export class ResourceNotFoundError extends NotFoundError {
    constructor(message) {
        super(message);
        this.code = 'RESOURCE_NOT_FOUND';
    }
}
