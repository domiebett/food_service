export class ValidationException {
    constraints: any;
    status: number;
    name: string;
    message: string;

    constructor(constraints) {
        this.name = 'Validation Error',
        this.message = 'Validation failed. Please check your inputs and try again',
        this.constraints = constraints;
        this.status = 422
    }
}
