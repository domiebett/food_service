export class ValidationException extends Error {
    constraints: any;
    status: number;
    name: string;
    message: string;

    constructor(constraints) {
        super();
        this.name = 'Validation Error',
        this.message = 'Validation failed. Please check your inputs and try again',
        this.constraints = constraints;
        this.status = 422
    }
}
