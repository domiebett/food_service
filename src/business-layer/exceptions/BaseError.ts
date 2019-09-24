export class BaseError extends Error {
    protected status: number;
    protected success: boolean;
    protected error: boolean;
    protected code: string;
    message: string;

    constructor(message) {
        super();
        this.name = 'SystemError';
        this.status = 500;
        this.success = false;
        this.error = true;
        this.code = 'SYSTEM_ERROR';
        this.message = message;
    }
}
